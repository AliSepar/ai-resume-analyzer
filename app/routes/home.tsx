import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate(); // to redirect or to send the user to the page
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadResumes, setLoadResumes] = useState(false);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResume = resumes.map(
        (resume) => JSON.parse(resume.value) as Resume
      );

      console.log("parsedResume", parsedResume);
      setResumes(parsedResume || []);
      setLoadResumes(false);
    };
    loadResumes();
  }, []);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your Applications & resume Rating</h1>
          {!loadResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback</h2>
          ) : (
            <h2>Review your submissions and check Ai-powered feedback</h2>
          )}
        </div>
        {loadResumes && (
          <div className="flex flex-col items-center justify-center">
            {" "}
            <img
              src="/images/resume-scan-2.gif"
              className="2-[200px]"
              alt="loader"
            />
          </div>
        )}
        {!loadResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume: Resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
