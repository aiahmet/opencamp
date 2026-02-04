import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold text-gray-900">
              OpenCamp
            </Link>
            <p className="mt-2 text-sm text-gray-600 max-w-sm">
              Learn programming with real execution, community feedback, and verifiable progress. 
              An open-source platform for mastering software engineering.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/learn" className="text-sm text-gray-600 hover:text-gray-900">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-sm text-gray-600 hover:text-gray-900">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/discuss" className="text-sm text-gray-600 hover:text-gray-900">
                  Discuss
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm text-gray-600 cursor-not-allowed">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-600 cursor-not-allowed">
                  Terms of Service
                </span>
              </li>
              <li>
                <Link href="/verify" className="text-sm text-gray-600 hover:text-gray-900">
                  Verify Certificate
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} OpenCamp. Open-source learning platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
