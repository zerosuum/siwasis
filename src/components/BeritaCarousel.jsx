"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function NewsCard({ item, isCenter }) {
  const WRAP_W = isCenter ? 422 : 350;
  const MIN_H = isCenter ? 470 : 398;
  const TITLE_MIN_H = isCenter ? 96 : 72;

  return (
    <div
      className={[
        "relative inline-flex flex-col overflow-hidden rounded-[24px] bg-wasis-nt80",
        "shadow-[0_6px_14px_-6px_rgba(24,39,75,0.12),_0_10px_32px_-4px_rgba(24,39,75,0.10)]",
        "p-5 md:p-6",
      ].join(" ")}
      style={{ width: WRAP_W, minHeight: MIN_H }}
    >
      <div className="relative w-full rounded-2xl overflow-hidden aspect-[16/10]">
        <Image
          src={item.image_url || "/placeholder-berita.jpg"}
          alt={item.title || "Berita"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 84vw, 422px"
          priority={isCenter}
        />
      </div>

      <h4
        className={[
          "mt-3 font-rem font-medium text-wasis-pr80 break-words",
          "text-[22px] leading-[30px] md:text-[24px] md:leading-[32px]",
          "line-clamp-3 md:line-clamp-4",
        ].join(" ")}
        style={{ minHeight: TITLE_MIN_H }}
        title={item.title}
      >
        {item.title || "Judul Berita"}
      </h4>

      <div className="mt-auto pt-4 w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-wasis-pr60/90 flex-shrink-0">
          <Calendar width={22} height={22} className="md:w-6 md:h-6" />
          <span className="text-[13px] md:text-[14px] font-rem whitespace-nowrap">
            {new Date(item.created_at || Date.now()).toLocaleDateString(
              "id-ID",
              { day: "numeric", month: "long", year: "numeric" }
            )}
          </span>
        </div>

        <Link
          href={`/blog/${item.id || "#"}`}
          className="flex-shrink-0 px-3 h-8 md:h-7 inline-flex items-center rounded-lg
                     bg-wasis-pr60 text-wasis-nt80 text-sm font-medium"
        >
          Selengkapnya
        </Link>
      </div>
    </div>
  );
}

function CardWrapper({ card, index, activeIndex, totalCards }) {
  let offset = index - activeIndex;
  if (offset > totalCards / 2) offset -= totalCards;
  else if (offset < -totalCards / 2) offset += totalCards;

  const isCenter = offset === 0;

  const X_STEP = 62;
  const animate = {
    x: `${offset * X_STEP}%`,
    zIndex: totalCards - Math.abs(offset),
    transition: { type: "spring", stiffness: 220, damping: 26, mass: 0.8 },
  };

  return (
    <motion.div
      className="absolute"
      style={{
        top: "50%",
        left: "50%",
        transformStyle: "preserve-3d",
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={animate}
      initial={false}
    >
      <NewsCard item={card} isCenter={isCenter} />
    </motion.div>
  );
}

export default function BeritaCarousel({ berita = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef(null);
  const autoplayDelay = 4000;

  const items = useMemo(
    () =>
      Array.isArray(berita) && berita.length
        ? berita
        : [
            {
              id: "p1",
              title: "Pembangunan Taman Baca Desa Cerdas",
              created_at: "2025-07-27",
              image_url: "/sample/news-1.jpg",
            },
            {
              id: "p2",
              title: "Turnamen Olahraga Antar Dusun: Semangat Kebersamaan",
              created_at: "2025-03-06",
              image_url: "/sample/news-2.jpg",
            },
            {
              id: "p3",
              title: "Festival Budaya: Wujud Cinta Kearifan Lokal",
              created_at: "2025-01-05",
              image_url: "/sample/news-3.jpg",
            },
          ],
    [berita]
  );

  useEffect(() => setActiveIndex(0), [items]);

  const goToNext = useCallback(() => {
    if (!items.length) return;
    setActiveIndex((p) => (p + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!isPaused && items.length) {
      autoplayRef.current = setInterval(goToNext, autoplayDelay);
    }
    return () => autoplayRef.current && clearInterval(autoplayRef.current);
  }, [isPaused, activeIndex, goToNext, items.length]);

  const changeSlide = (i) => {
    if (!items.length) return;
    setActiveIndex(((i % items.length) + items.length) % items.length);
    autoplayRef.current && clearInterval(autoplayRef.current);
    if (!isPaused) autoplayRef.current = setInterval(goToNext, autoplayDelay);
  };

  const onDragEnd = (_e, info) => {
    const dx = info.offset.x;
    const t = 75;
    if (dx > t) changeSlide(activeIndex - 1);
    else if (dx < -t) changeSlide(activeIndex + 1);
  };

  return (
    <section className={`w-full font-sans`}>
      <div
        className="w-full max-w-[1100px] mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative w-full flex flex-col p-4 md:p-6">
          <div className="relative w-full h-[560px] md:h-[600px] flex items-center justify-center overflow-visible">
            <motion.div
              className="w-full h-full"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={onDragEnd}
            >
              {items.map((card, i) => (
                <CardWrapper
                  key={card.id || i}
                  card={card}
                  index={i}
                  activeIndex={activeIndex}
                  totalCards={items.length}
                />
              ))}
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => changeSlide(activeIndex - 1)}
              className="w-24 h-24 flex items-center justify-center rounded-full transition"
              aria-label="Sebelumnya"
            >
              <img
                src="/icons/arrow-left.svg"
                alt="Previous"
                className="w-24 h-24"
              />
            </button>

            <div className="flex items-center justify-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => changeSlide(i)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    activeIndex === i ? "w-6 bg-wasis-pr60" : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => changeSlide(activeIndex + 1)}
              className="w-24 h-24 flex items-center justify-center rounded-full transition"
              aria-label="Berikutnya"
            >
              <img
                src="/icons/arrow-right.svg"
                alt="Next"
                className="w-24 h-24"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
