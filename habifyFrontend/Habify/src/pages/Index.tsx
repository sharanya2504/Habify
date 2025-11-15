import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import penguinHero from "@/assets/penguin-hero.png";

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32 relative overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-accent/10 blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-40 right-20 w-24 h-24 rounded-full bg-secondary/10 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Gamified Habit Tracking</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">Build Better Habits With Your </h1>

            <p className="text-xl text-muted-foreground max-w-lg">
              Stay accountable, track your progress, and grow together with your adorable penguin friend. Turn habits into an adventure!
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-full px-8 text-lg h-14"
                asChild
              >
                <Link to="/onboarding/color">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-lg h-14 glass"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 gradient-primary opacity-20 blur-3xl rounded-full" />
            <img
              src={penguinHero}
              alt="Cute penguin companion"
              className="relative z-10 w-full max-w-md mx-auto animate-float drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why PenguinPal?</h2>
          <p className="text-xl text-muted-foreground">Everything you need to build lasting habits</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Smart Goal Tracking",
              description: "Set daily tasks, build streaks, and watch your penguin celebrate every win with you.",
              gradient: "gradient-primary",
            },
            {
              icon: Users,
              title: "Social Accountability",
              description: "Connect with friends, share progress, and motivate each other to stay consistent.",
              gradient: "gradient-accent",
            },
            {
              icon: Trophy,
              title: "Gamified Rewards",
              description: "Earn gems, unlock quests, and level up your penguin as you complete your habits.",
              gradient: "gradient-success",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass rounded-3xl p-8 hover:scale-105 transition-all hover:shadow-2xl group"
            >
              <div
                className={`w-16 h-16 rounded-2xl ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Loved by thousands</h2>
          <p className="text-xl text-muted-foreground">See what our users are saying</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah M.",
              avatar: "👩",
              text: "My penguin keeps me motivated every single day. I've never stuck to my habits this long!",
            },
            {
              name: "James K.",
              avatar: "👨",
              text: "The social features are amazing. Competing with friends makes it so much more fun!",
            },
            {
              name: "Emma L.",
              avatar: "👱‍♀️",
              text: "I love how cute and encouraging my penguin is. It's like having a cheerleader in my pocket!",
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 hover:scale-105 transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-2xl">{testimonial.avatar}</div>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">Verified User</div>
                </div>
              </div>
              <p className="text-muted-foreground italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-border/30">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full gradient-primary" />
            <span className="font-bold text-lg">PenguinPal</span>
          </div>

          <div className="flex space-x-6 text-sm text-muted-foreground">
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
