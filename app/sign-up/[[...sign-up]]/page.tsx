import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px]">
          <div className="mb-8 text-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              OpenCamp
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Create your free account and start learning today.
            </p>
          </div>
          
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <SignUp 
              routing="hash"
              redirectUrl="/learn"
              appearance={{
                elements: {
                  formButtonPrimary: 
                    "bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors",
                  formFieldInput: 
                    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all",
                  formFieldLabel: 
                    "text-sm font-medium text-gray-700 mb-1",
                  footerAction: 
                    "text-gray-600 hover:text-gray-900",
                  footerActionLink: 
                    "text-blue-600 hover:text-blue-700 font-medium",
                  card: 
                    "shadow-none",
                },
              }}
            />
          </div>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>
          
          <p className="mt-4 text-center text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
