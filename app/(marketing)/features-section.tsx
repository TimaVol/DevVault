import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { features } from "./content";

export function FeaturesSection() {
  return (
    <section id="features" className="border-t px-4 py-20 md:px-10">
      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="transition-colors hover:border-primary/40"
          >
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
