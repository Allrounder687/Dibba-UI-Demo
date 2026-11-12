import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Phone, Mail, Handshake } from "lucide-react";
import { dictionaries, isValidLocale } from "@/lib/i18n/dictionaries";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = isValidLocale(locale) ? locale : "en";
  return { title: dictionaries[loc].nav.contact };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = dictionaries[locale];

  return (
    <div>
      <div className="bg-[#0A2240] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <Badge variant="goldDark">{dict.nav.contact}</Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {dict.commercial.sponsorshipTitle}
          </h1>
          <p className="max-w-2xl text-base text-white/80">
            {dict.commercial.sponsorshipSubtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <Card className="border-[#DCE3EE] bg-white p-6 space-y-5">
              <h2 className="text-xl font-extrabold text-[#071426]">{dict.meta.siteName}</h2>
              <div className="space-y-4 text-sm text-slate-700">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#2678FF]" />
                  <span>{dict.footer.address}</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-[#2678FF]" />
                  <a href="tel:+97192444216" dir="ltr" className="font-semibold hover:text-[#2678FF]">
                    +971 9 244 4216
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-[#2678FF]" />
                  <a href="mailto:info@dibbaclub.ae" className="font-semibold hover:text-[#2678FF]">
                    info@dibbaclub.ae
                  </a>
                </p>
              </div>
            </Card>

            <Card className="border-[#0A2240]/15 bg-[#0A2240] p-6 space-y-3 text-white">
              <Handshake className="h-6 w-6 text-[#D5A84B]" />
              <h3 className="text-base font-bold">{dict.commercial.sponsorshipTitle}</h3>
              <p className="text-xs leading-relaxed text-white/75">
                {dict.commercial.sponsorshipSubtitle}
              </p>
            </Card>
          </div>

          <Card className="border-[#DCE3EE] bg-white lg:col-span-7">
            <CardContent className="p-6 sm:p-8">
              <EnquiryForm
                dict={dict}
                type="contact"
                programOptions={[
                  "General Enquiry / استفسار عام",
                  "Commercial Sponsorship / الرعاية التجارية",
                  "Media Accreditation / الاعتماد الإعلامي",
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
