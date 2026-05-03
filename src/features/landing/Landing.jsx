import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useEffect } from 'react'
import { Logo } from '../../components/common/Logo'
import { Reveal } from '../../components/common/Reveal'
import {
  Package,
  Users,
  BarChart3,
  Bell,
  MessageSquare,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
  Layers,
  ArrowRight,
} from 'lucide-react'

const features = [
  { icon: Package,      title: 'Asset Management',   description: 'Track every company asset with full history, status, and assignment records in real time.' },
  { icon: Users,        title: 'Employee Directory',  description: 'Manage your team, roles, and departments in one place with quick access to contact details.' },
  { icon: Layers,       title: 'Inventory Control',   description: 'Monitor product stock levels, get low-stock alerts, and keep inventory always up to date.' },
  { icon: BarChart3,    title: 'Reports & Analytics', description: 'Generate and publish detailed reports on assets, usage, and performance for smart decisions.' },
  { icon: ClipboardList,title: 'Task Management',     description: 'Assign and track tasks across your team with priority levels, deadlines, and status updates.' },
  { icon: Bell,         title: 'Notifications',       description: 'Stay informed with instant in-app notifications for assignments, approvals, and updates.' },
  { icon: MessageSquare,title: 'Internal Chat',       description: 'Communicate with colleagues through a built-in messaging system — no external tools needed.' },
  { icon: ShieldCheck,  title: 'Role-Based Access',   description: 'Granular permissions for admins, asset managers, and users keep your data secure.' },
]

const reasons = [
  {
    icon: TrendingUp,
    title: 'Built for Growth',
    body: 'EVA Cosmetics needed a centralized system to scale its internal operations as the company expanded rapidly across multiple departments.',
  },
  {
    icon: ShieldCheck,
    title: 'Eliminate Manual Tracking',
    body: 'Spreadsheets and paper logs were replaced with a real-time digital platform that reduces errors and saves hours of administrative work weekly.',
  },
  {
    icon: Users,
    title: 'One Platform for Every Team',
    body: 'From IT tracking devices to HR managing employees — every department works inside a single unified system with the right access level.',
  },
]

const stats = [
  { value: '8+',       label: 'Core Modules' },
  { value: '100%',     label: 'Role-Based Access' },
  { value: 'Real-time',label: 'Notifications' },
  { value: 'Secure',   label: 'JWT Authentication' },
]

export const Landing = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true })
  }, [user, loading, navigate])

  if (loading) return null

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md
        border-b border-gray-100 dark:border-gray-800 animate-slideDown">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="md" to="/" />
          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                hover:text-primary-600 dark:hover:text-primary-400
                transition-colors duration-200"
            >
              Log In
            </Link>
            <Link
              to="/login"
              className="btn-press px-4 py-2 text-sm font-medium rounded-xl
                bg-primary-600 text-white hover:bg-primary-700
                shadow-sm hover:shadow-md hover:shadow-primary-200 dark:hover:shadow-none
                transition-all duration-200"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <Reveal direction="down">
          <span className="inline-block mb-6 px-3 py-1 rounded-full text-xs font-semibold
            bg-primary-50 dark:bg-primary-900/30
            text-primary-700 dark:text-primary-300
            border border-primary-100 dark:border-primary-800
            uppercase tracking-widest">
            Asset Management System
          </span>
        </Reveal>

        <Reveal delay={80}>
          <div className="flex justify-center mb-8">
            <Logo size="xl" to={null} />
          </div>
        </Reveal>

        <Reveal delay={160}>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white mb-6">
            Everything your team needs,{' '}
            <span className="text-primary-600">in one place.</span>
          </h1>
        </Reveal>

        <Reveal delay={240}>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 mb-10">
            Next-Step is a centralized platform built for EVA Cosmetics that helps your organization
            track assets, manage employees, control inventory, and collaborate — all from a single,
            secure dashboard.
          </p>
        </Reveal>

        <Reveal delay={320}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="btn-press group inline-flex items-center justify-center gap-2
                px-8 py-3 rounded-xl bg-primary-600 text-white font-semibold
                hover:bg-primary-700 transition-all duration-200
                shadow-lg shadow-primary-200 dark:shadow-none"
            >
              Sign In to Your Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <a
              href="#features"
              className="btn-press inline-flex items-center justify-center
                px-8 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                text-gray-700 dark:text-gray-300 font-semibold
                hover:bg-gray-50 dark:hover:bg-gray-800
                transition-all duration-200"
            >
              Explore Features
            </a>
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal delay={400}>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 stagger">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="card-hover p-5 rounded-2xl bg-gray-50 dark:bg-gray-900
                  border border-gray-100 dark:border-gray-800"
              >
                <p className="text-2xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Why we built it ── */}
      <section className="bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Why we built Next-Step
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                As EVA Cosmetics grew, managing internal operations manually became unsustainable.
                Next-Step was created to solve that.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 120}>
                <div className="card-hover bg-white dark:bg-gray-950 rounded-2xl p-6
                  border border-gray-100 dark:border-gray-800 h-full">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30
                    flex items-center justify-center mb-4">
                    <r.icon size={22} className="text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{r.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Everything you need
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              A complete suite of tools designed around real operational needs.
            </p>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 70} direction="up">
              <div
                className="card-hover group p-5 rounded-2xl border border-gray-100 dark:border-gray-800
                  hover:border-primary-200 dark:hover:border-primary-800
                  bg-white dark:bg-gray-900 h-full"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30
                  flex items-center justify-center mb-3
                  group-hover:bg-primary-100 dark:group-hover:bg-primary-900/60
                  transition-colors duration-200">
                  <f.icon size={19} className="text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-primary-600 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
        <Reveal>
          <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to take the next step?
            </h2>
            <p className="text-primary-100 mb-8 max-w-lg mx-auto text-lg">
              Log in with your company account and take control of your assets, team, and inventory today.
            </p>
            <Link
              to="/login"
              className="btn-press inline-flex items-center gap-2
                px-8 py-3 rounded-xl bg-white text-primary-700 font-semibold
                hover:bg-primary-50 transition-all duration-200 shadow-xl"
            >
              Log In Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" to="/" />
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Next-Step · EVA Cosmetics Group. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
