import Link from 'next/link';
import {
  Globe,
  Cloud,
  Wrench,
  BookOpen,
  Bot,
  Zap,
  Lightbulb,
  Search,
  Compass
} from 'lucide-react';
import ShaderBackground from "@/components/shader-background";
import { SearchButton } from "@/components/search-button";
import { QuickStartCard, TopicCard } from "@/components/card";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero Section with Background Image */}
      <section className="relative" style={{ height: '24rem' }}>
        <ShaderBackground>
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
            <div className="text-center">
              {/* Main heading with white text */}
              <h1 className="text-white font-semibold" style={{ fontSize: '28px', margin: 0 }}>
                Welcome to{' '}
                <span
                  style={{
                    background: 'linear-gradient(102deg, rgb(255, 212, 95) -3.17%, rgb(255, 164, 90) 40.51%, rgb(255, 98, 0) 89.47%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  EurekaCodes
                </span>
              </h1>
              <p className="text-white font-normal mt-4 max-w-2xl mx-auto" style={{ fontSize: '16px' }}>
                Stress-free AI DevOps; From Infrastructure to Scalable Microservices
              </p>

              {/* Floating Search Bar */}
              <div className="max-w-xl mx-auto mt-8">
                <SearchButton />
              </div>
            </div>
          </div>
        </ShaderBackground>
      </section>

      {/* Origin Section */}
      {/*<section className="relative" style={{ height: '24rem' }}>*/}
      {/*  /!* Background Image *!/*/}
      {/*  <div*/}
      {/*    className="absolute inset-0 bg-cover bg-center bg-no-repeat"*/}
      {/*    style={{*/}
      {/*      backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2672&q=80")',*/}
      {/*    }}*/}
      {/*  />*/}
      {/*  /!* Dark Overlay *!/*/}
      {/*  <div className="absolute inset-0 bg-black/60" />*/}
      {/*  /!* Content *!/*/}
      {/*  <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">*/}
      {/*    <div className="text-center">*/}
      {/*      /!* Main heading with white text *!/*/}
      {/*      <h1 className="text-white font-semibold" style={{ fontSize: '28px', margin: 0 }}>*/}
      {/*        Welcome to <span className="text-blue-400">EurekaBox</span>*/}
      {/*      </h1>*/}
      {/*      <p className="text-white font-normal mt-4 max-w-2xl mx-auto" style={{ fontSize: '16px' }}>*/}
      {/*        Transform how you build and document software systems with intelligent automation*/}
      {/*      </p>*/}
      {/*      /!* Floating Search Bar *!/*/}
      {/*      <div className="max-w-xl mx-auto mt-8">*/}
      {/*          <SearchButton />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}

      {/* Quick Start Section */}
      <section className="my-12 mx-auto max-w-6xl px-5">
        <p className="text-gray-900 dark:text-gray-200 text-left mt-4 text-2xl mb-4 font-semibold">
          Get started in 5 minutes
        </p>

        <div>
          <div className="not-prose grid gap-x-4 sm:grid-cols-3">
            <QuickStartCard
              title="Quick start"
              description="Learn how to use EurekaCodes Pro Plan with workspaces and projects"
              href="/docs/getting-started/C346"
              icon={<Globe className="w-6 h-6" />}
            />
            <QuickStartCard
              title="Chat App Application Guide"
              description="How to apply Chat App service in EurekaCodes platform"
              href="/docs/getting-started/C348"
              icon={<Bot className="w-6 h-6" />}
            />
          </div>
        </div>

        {/* Topics Section */}
        <p className="text-gray-900 dark:text-gray-200 text-left mt-10 text-2xl mb-4 font-semibold">
          Technology Stack
        </p>

        <div className="not-prose grid gap-x-4 sm:grid-cols-3">
          <TopicCard
            title="eureka-chats-front"
            description="Real-time Chat Application frontend built with React, TypeScript, and modern UI components"
            href="/docs/technology/C319"
            icon={<Zap className="w-6 h-6" />}
          />
          <TopicCard
            title="eureka-sockets-api"
            description="Serverless event-driven WebSocket service providing real-time communication in MSA environments"
            href="/docs/technology/C321"
            icon={<Cloud className="w-6 h-6" />}
          />
          <TopicCard
            title="eureka-chats-api"
            description="Serverless real-time chat microservice with WebSocket integration for backend API services"
            href="/docs/technology/C322"
            icon={<Wrench className="w-6 h-6" />}
          />
          <TopicCard
            title="MCP Utilization: LangChain & LangGraph"
            description="Framework for developing AI applications with large language models and flexible workflows"
            href="/docs/technology/C338"
            icon={<Bot className="w-6 h-6" />}
          />
        </div>
      </section>

      {/* TODO: add some Section */}
      <section className="py-10 px-6 max-w-6xl mx-auto w-full text-center">
        <div className="text-fd-muted-foreground space-y-4">
        </div>
      </section>
    </main>
  );
}
