import Layout from "@/components/layout";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Minus, Plus, Bed, Bath, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Build() {
  const [sqFt, setSqFt] = useState([2400]);
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [basement, setBasement] = useState(false);

  const houseStyles = [
    { id: "modern", name: "Modern", img: "/house-complete.png" },
    { id: "ranch", name: "Ranch", img: "/house-construction.png" }, // Using placeholders, ideally distinct images
    { id: "two-story", name: "Two-Story", img: "/house-complete.png" },
    { id: "lakeside", name: "Lakeside", img: "/house-construction.png" },
  ];

  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-3xl font-serif font-medium mb-1">Build Your Home</h1>
        <p className="text-muted-foreground">Customize your dream specifications.</p>
      </header>

      <div className="space-y-8 pb-10">
        
        {/* Square Footage */}
        <div className="bg-white p-6 rounded-3xl border border-border/40 shadow-sm">
          <div className="flex justify-between mb-4">
            <Label className="text-base font-medium">Square Footage</Label>
            <span className="text-primary font-serif font-bold">{sqFt} sqft</span>
          </div>
          <Slider 
            value={sqFt} 
            onValueChange={setSqFt} 
            max={5000} 
            step={100} 
            className="py-4" 
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Small</span>
            <span>Medium</span>
            <span>Large</span>
          </div>
        </div>

        {/* Basement */}
        <div className="bg-white p-6 rounded-3xl border border-border/40 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
             <LayoutTemplate className="w-5 h-5 text-secondary" />
             <Label className="text-base font-medium">Finished Basement</Label>
          </div>
          <Switch checked={basement} onCheckedChange={setBasement} />
        </div>

        {/* Rooms */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-border/40 shadow-sm flex flex-col items-center">
            <Label className="mb-4 text-muted-foreground flex items-center gap-2"><Bed className="w-4 h-4"/> Bedrooms</Label>
            <div className="flex items-center gap-4">
              <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}><Minus className="w-4 h-4" /></Button>
              <span className="text-2xl font-serif font-medium w-6 text-center">{bedrooms}</span>
              <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={() => setBedrooms(bedrooms + 1)}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-border/40 shadow-sm flex flex-col items-center">
            <Label className="mb-4 text-muted-foreground flex items-center gap-2"><Bath className="w-4 h-4"/> Bathrooms</Label>
            <div className="flex items-center gap-4">
              <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}><Minus className="w-4 h-4" /></Button>
              <span className="text-2xl font-serif font-medium w-6 text-center">{bathrooms}</span>
              <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={() => setBathrooms(bathrooms + 1)}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>

        {/* Style Selection */}
        <div>
          <Label className="text-base font-medium mb-4 block">Architectural Style</Label>
          <RadioGroup defaultValue="modern" className="grid grid-cols-2 gap-4">
            {houseStyles.map((style) => (
              <div key={style.id} className="relative">
                <RadioGroupItem value={style.id} id={style.id} className="peer sr-only" />
                <Label
                  htmlFor={style.id}
                  className="flex flex-col items-center p-4 rounded-3xl border-2 border-transparent bg-white shadow-sm hover:bg-neutral-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all cursor-pointer h-full"
                >
                  <img src={style.img} alt={style.name} className="w-full h-24 object-cover rounded-xl mb-3 opacity-90" />
                  <span className="font-medium text-sm">{style.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

      </div>
    </Layout>
  );
}
