import React from 'react';
import Layout from '../../components/AppShell/Layout';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import AIChatWidget from '../../components/ChatAgent/AIChatWidget';
import { MessageSquareCode } from 'lucide-react';

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <MessageSquareCode className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">FoodPack AI Scientific Chatbot</h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Conversational RAG assistant grounded in real database materials, barrier kinetics, and FSSAI safety rules.
              </p>
            </div>
          </div>

          <AIChatWidget />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
