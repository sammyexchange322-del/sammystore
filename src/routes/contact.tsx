import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactInfo } from "@/data/site";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contacts = [
    { icon: Mail, label: "Mail Us", value: contactInfo.email, href: `mailto:${contactInfo.email}` },
    { icon: Phone, label: "Phone", value: contactInfo.phone, href: `tel:${contactInfo.phoneRaw}` },
    { icon: MapPin, label: "Location", value: contactInfo.location },
  ];

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We're here to help — reach out any time."
        breadcrumbs={[{ name: "Contact" }]}
      />

      <section className="w-full bg-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {contacts.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="bg-muted/40 rounded-2xl p-6 border border-border">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h3 className="text-base font-semibold text-brand-navy mb-1">{label}</h3>
                  {href ? (
                    <a href={href} className="text-muted-foreground hover:text-brand-orange transition-colors text-sm break-all">
                      {value}
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-sm">{value}</p>
                  )}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-2"
            >
              <form
                onSubmit={handleSubmit}
                className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border space-y-5"
              >
                {submitted && (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    Thanks! Your message has been sent. We'll be in touch shortly.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field id="name" label="Name" value={formData.name} onChange={handleChange} placeholder="Your name" />
                  <Field id="email" label="Email" type="email" value={formData.email} onChange={handleChange} placeholder="you@email.com" />
                </div>
                <Field id="subject" label="Subject" value={formData.subject} onChange={handleChange} placeholder="What's this about?" />

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-brand-navy font-medium">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us what you need…"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="border-border focus-visible:ring-brand-orange/30 resize-none"
                  />
                </div>

                <Button type="submit" className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white h-12 font-semibold">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-brand-navy font-medium">{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="border-border focus-visible:ring-brand-orange/30 h-11"
      />
    </div>
  );
}
