import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dictionaries, isValidLocale } from "@/lib/i18n/dictionaries";
import { ClubRepository } from "@/db/repository";
import { NewsFeedInteractive } from "@/components/club/NewsFeedInteractive";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = isValidLocale(locale) ? locale : "en";
  return { title: dictionaries[loc].nav.news };
}

const GALLERY_PHOTOS = [
  "/assets/H0I0851-scaled-rv3cgnc8gmqjvxonfjgdm2gonr09jo6hte61rbflzi.jpg",
  "/assets/12222222.jpg",
  "/assets/IMG-20261107-WA0004-rvzyvxah4hvo0qod5hnd9jg7xfu2o6z6cdrxh1j1n2.jpg",
  "/assets/WhatsApp-Image-2026-11-07-at-6.46.04-PM-rw1ikln0ue4p1qrt90tc0o0ov31gxbeimlxpvp6bda.jpeg",
  "/assets/WhatsApp-Image-2026-11-07-at-8.17.22-PM-rw0gk3g4muqzrslpcz8dbi65mm899hj5h4xffw9sem.jpeg",
  "/assets/WhatsApp-Image-2026-11-03-at-2.13.46-PM-1-rvtb1ty5uoggva6f6utjbtnbce6h9h869l9rvtdudq.jpeg",
];

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = dictionaries[locale];
  const articles = await ClubRepository.getNews(false);

  return (
    <div>
      <div className="bg-[#0A2240] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D5A84B]">
            {dict.news.eyebrow}
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {dict.news.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        <NewsFeedInteractive locale={locale} dict={dict} articles={articles} />

        <section className="space-y-6 border-t border-[#DCE3EE] pt-12">
          <h2 className="text-2xl font-black text-[#071426]">{dict.news.galleryTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY_PHOTOS.map((src, idx) => (
              <div
                key={src}
                className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[#DCE3EE] bg-white shadow-xs"
              >
                <Image
                  src={src}
                  alt={`Dibba SCC Gallery ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
