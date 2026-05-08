import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 font-sans">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-md">
            TM
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            TaskFlow
          </span>
        </div>
        <nav className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Log in
          </Link>
          <Button
            asChild
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Link to="/register">Sign up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-24">
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 mb-4">
            🚀 The smarter way to manage tasks
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl md:text-7xl">
            Organize your work. <br className="hidden sm:block" />
            <span className="text-indigo-600">Empower your life.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-zinc-600 sm:text-xl leading-relaxed">
            TaskFlow is the ultimate workspace to track projects, manage tasks,
            and collaborate effortlessly. Stay productive and focused on what
            matters most.
          </p>

          <div className="flex flex-col items-center justify-center space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
            >
              <Link to="/register">Get Started for Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-lg border-zinc-300 text-zinc-700 hover:bg-zinc-100"
            >
              <Link to="/login">Sign in to your account</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-8 text-center text-sm text-zinc-500">
        <p>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
