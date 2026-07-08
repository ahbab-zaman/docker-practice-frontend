import Card from "@/components/ui/Card";
import logo from "@/assets/logo.png";
const concepts = [
  {
    title: "Docker Images",
    description:
      "Immutable snapshots of a filesystem and application code. Images are built layer by layer and serve as templates for containers.",
    icon: "📦",
  },
  {
    title: "Docker Containers",
    description:
      "Running instances of images. Containers are lightweight, isolated environments that share the host OS kernel.",
    icon: "🚢",
  },
  {
    title: "Docker Volumes",
    description:
      "Persistent storage that outlives containers. Volumes let data survive container restarts and are shared between containers.",
    icon: "💾",
  },
  {
    title: "Docker Networks",
    description:
      "Virtual networks that connect containers. Containers can communicate privately across bridges, overlays, or host networks.",
    icon: "🌐",
  },
];

const architecture = [
  {
    name: "Nginx",
    role: "Reverse proxy — routes traffic to frontend & backend",
    color: "text-success",
  },
  {
    name: "React App",
    role: "Frontend served by Vite, proxied through Nginx",
    color: "text-primary",
  },
  {
    name: "API Server",
    role: "Express.js backend handling auth & business logic",
    color: "text-accent",
  },
  {
    name: "PostgreSQL",
    role: "Persistent relational database",
    color: "text-primary",
  },
];

function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center">
        <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-primary/10 p-4">
          <span className="text-5xl">
            <img
              src={logo}
              alt="DockerBase"
              className="h-20 w-20"
            />
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          DockerBase
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          A hands-on project for learning Docker, containerization, and
          multi-service orchestration — from development to production.
        </p>
      </section>

      {/* Docker Concepts */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold text-foreground">
          Core Docker Concepts
        </h2>
        <p className="mt-1 text-muted">
          Understanding these building blocks is essential to mastering
          containerization.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {concepts.map((c) => (
            <Card key={c.title}>
              <span className="text-2xl">{c.icon}</span>
              <h3 className="mt-3 font-semibold text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {c.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Project Architecture */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold text-foreground">
          Project Architecture
        </h2>
        <p className="mt-1 text-muted">
          This application is composed of multiple services, each running in its
          own container.
        </p>
        <div className="mt-8 space-y-4">
          {architecture.map((svc) => (
            <Card key={svc.name} className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <div className={`text-lg font-bold ${svc.color}`}>◉</div>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">{svc.name}</h3>
                <p className="text-sm text-muted">{svc.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Getting Started */}
      <section className="mt-20">
        <Card>
          <h2 className="text-2xl font-semibold text-foreground">
            Getting Started
          </h2>
          <p className="mt-1 text-muted">
            Spin up the entire stack with a single command.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-foreground/5 p-4 text-sm text-foreground">
            <code>{`docker compose up --build`}</code>
          </pre>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <h4 className="font-medium text-foreground">1. Clone</h4>
              <p className="mt-1 text-sm text-muted">
                Clone the repo and navigate to the project root.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground">2. Compose</h4>
              <p className="mt-1 text-sm text-muted">
                Run{" "}
                <code className="rounded bg-foreground/5 px-1.5 py-0.5 text-xs">
                  docker compose up --build
                </code>
                .
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground">3. Explore</h4>
              <p className="mt-1 text-sm text-muted">
                Open{" "}
                <code className="rounded bg-foreground/5 px-1.5 py-0.5 text-xs">
                  http://localhost:8080
                </code>
                .
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer note */}
      <p className="mt-20 text-center text-xs text-muted">
        Built with React, TypeScript, Tailwind CSS, and Docker.
      </p>
    </div>
  );
}

export default HomePage;
