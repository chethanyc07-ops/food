const crypto = require('crypto');
const bcrypt = require('bcryptjs');

class InMemoryCollection {
  constructor(name) {
    this.name = name;
    this.docs = [];
  }

  generateId() {
    return crypto.randomBytes(12).toString('hex');
  }

  async create(data) {
    const doc = {
      _id: data._id || this.generateId(),
      ...data,
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (doc.password && typeof doc.password === 'string' && !doc.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      doc.password = await bcrypt.hash(doc.password, salt);
    }

    // Attach matchPassword method if user
    if (this.name === 'User') {
      doc.matchPassword = async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
      };
    }

    this.docs.push(doc);
    return doc;
  }

  async insertMany(array) {
    const results = [];
    for (const item of array) {
      const created = await this.create(item);
      results.push(created);
    }
    return results;
  }

  find(query = {}) {
    let matches = this._filterDocs(query);

    const queryObj = {
      _docs: matches,
      _sortKey: null,
      _sortDir: 1,
      _skip: 0,
      _limit: null,
      _populates: [],

      populate(field, select) {
        this._populates.push({ field, select });
        return this;
      },
      sort(sortOpt) {
        if (typeof sortOpt === 'object') {
          const key = Object.keys(sortOpt)[0];
          this._sortKey = key;
          this._sortDir = sortOpt[key];
        } else if (typeof sortOpt === 'string') {
          if (sortOpt.startsWith('-')) {
            this._sortKey = sortOpt.substring(1);
            this._sortDir = -1;
          } else {
            this._sortKey = sortOpt;
            this._sortDir = 1;
          }
        }
        return this;
      },
      skip(n) {
        this._skip = Number(n) || 0;
        return this;
      },
      limit(n) {
        this._limit = Number(n) || 0;
        return this;
      },
      exec: async () => {
        let list = [...matches];
        if (queryObj._sortKey) {
          list.sort((a, b) => {
            const va = a[queryObj._sortKey] ?? '';
            const vb = b[queryObj._sortKey] ?? '';
            if (va < vb) return -1 * queryObj._sortDir;
            if (va > vb) return 1 * queryObj._sortDir;
            return 0;
          });
        }
        if (queryObj._skip) {
          list = list.slice(queryObj._skip);
        }
        if (queryObj._limit && queryObj._limit > 0) {
          list = list.slice(0, queryObj._limit);
        }
        return list;
      },
      then(resolve, reject) {
        return this.exec().then(resolve, reject);
      },
    };

    return queryObj;
  }

  findOne(query = {}) {
    const self = this;
    return {
      _selectPassword: false,
      select(str) {
        if (str && str.includes('+password')) {
          this._selectPassword = true;
        }
        return this;
      },
      populate(field) {
        return this;
      },
      exec: async () => {
        const matches = self._filterDocs(query);
        if (matches.length === 0) return null;
        const doc = { ...matches[0] };
        if (self.name === 'User' && doc.password) {
          doc.matchPassword = async function (enteredPassword) {
            return await bcrypt.compare(enteredPassword, this.password);
          };
          doc.save = async function () {
            const idx = self.docs.findIndex((d) => d._id === this._id);
            if (idx >= 0) self.docs[idx] = { ...this };
          };
        }
        return doc;
      },
      then(resolve, reject) {
        return this.exec().then(resolve, reject);
      },
    };
  }

  findById(id) {
    const self = this;
    return {
      select(str) {
        return this;
      },
      populate(field) {
        return this;
      },
      exec: async () => {
        const doc = self.docs.find((d) => String(d._id) === String(id));
        if (!doc) return null;
        const cloned = { ...doc };
        if (self.name === 'User' && cloned.password) {
          cloned.matchPassword = async function (enteredPassword) {
            return await bcrypt.compare(enteredPassword, this.password);
          };
        }
        return cloned;
      },
      then(resolve, reject) {
        return this.exec().then(resolve, reject);
      },
    };
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const idx = this.docs.findIndex((d) => String(d._id) === String(id));
    if (idx === -1) return null;
    this.docs[idx] = {
      ...this.docs[idx],
      ...updateData,
      updatedAt: new Date(),
    };
    return this.docs[idx];
  }

  async findByIdAndDelete(id) {
    const idx = this.docs.findIndex((d) => String(d._id) === String(id));
    if (idx === -1) return null;
    const removed = this.docs.splice(idx, 1)[0];
    return removed;
  }

  async findOneAndDelete(query) {
    const matches = this._filterDocs(query);
    if (matches.length === 0) return null;
    const toDelete = matches[0];
    return await this.findByIdAndDelete(toDelete._id);
  }

  async countDocuments(query = {}) {
    const matches = this._filterDocs(query);
    return matches.length;
  }

  async deleteMany(query = {}) {
    const before = this.docs.length;
    const toKeep = [];
    for (const doc of this.docs) {
      if (!this._matchDoc(doc, query)) {
        toKeep.push(doc);
      }
    }
    this.docs = toKeep;
    return { deletedCount: before - toKeep.length };
  }

  async updateMany(query = {}, update = {}) {
    let count = 0;
    for (const doc of this.docs) {
      if (this._matchDoc(doc, query)) {
        Object.assign(doc, update);
        count++;
      }
    }
    return { modifiedCount: count };
  }

  async aggregate(pipeline = []) {
    // Simple group count aggregate support
    const groupStage = pipeline.find((p) => p.$group);
    if (groupStage) {
      const field = groupStage.$group._id.replace('$', '');
      const map = {};
      for (const d of this.docs) {
        const val = d[field] || 'Other';
        map[val] = (map[val] || 0) + 1;
      }
      return Object.entries(map).map(([_id, count]) => ({ _id, count }));
    }
    return [];
  }

  _filterDocs(query) {
    return this.docs.filter((doc) => this._matchDoc(doc, query));
  }

  _matchDoc(doc, query) {
    if (!query || Object.keys(query).length === 0) return true;

    for (const key of Object.keys(query)) {
      const condition = query[key];

      if (key === '_id') {
        if (typeof condition === 'object' && condition.$in) {
          const ids = condition.$in.map(String);
          if (!ids.includes(String(doc._id))) return false;
          continue;
        } else {
          if (String(doc._id) !== String(condition)) return false;
          continue;
        }
      }

      if (key === '$or') {
        const anyMatch = condition.some((cond) => this._matchDoc(doc, cond));
        if (!anyMatch) return false;
        continue;
      }

      if (typeof condition === 'object' && condition !== null) {
        if (condition.$regex) {
          const reg = new RegExp(condition.$regex, condition.$options || 'i');
          const val = doc[key] ?? '';
          if (!reg.test(String(val))) return false;
          continue;
        }
        if (condition.$in) {
          const val = doc[key];
          if (Array.isArray(val)) {
            const hasAny = val.some((v) => condition.$in.some((inVal) => {
              if (inVal instanceof RegExp) return inVal.test(v);
              return inVal === v;
            }));
            if (!hasAny) return false;
          } else {
            if (!condition.$in.includes(val)) return false;
          }
          continue;
        }
      }

      if (doc[key] !== condition) {
        return false;
      }
    }
    return true;
  }
}

const memoryStore = {
  isInMemory: false,
  User: new InMemoryCollection('User'),
  Commodity: new InMemoryCollection('Commodity'),
  Material: new InMemoryCollection('Material'),
  Recommendation: new InMemoryCollection('Recommendation'),
  ChatMessage: new InMemoryCollection('ChatMessage'),
  Notification: new InMemoryCollection('Notification'),
};

module.exports = memoryStore;
