import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <div className="py-4 px-6 border-b grid grid-cols-subgrid col-span-12">
        <div className="container mx-auto col-span-12 md:col-span-9">
          <Link to="/">
            <h1 className="text-2xl font-semibold tracking-tight">
              Workoast Wheels
            </h1>
          </Link>
        </div>
      </div>
    </nav>
  );
}
