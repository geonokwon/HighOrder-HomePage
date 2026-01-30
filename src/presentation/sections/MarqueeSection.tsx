"use client";
import { motion } from "framer-motion";

const stores = [
  { name: "경성맥주", image: "/Marquee/Marquee_Image_1.png" },
  { name: "가장맛있는족발", image: "/Marquee/Marquee_Image_2.png" },
  { name: "소복소복", image: "/Marquee/Marquee_Image_5.png" },
  { name: "한신우동", image: "/Marquee/Marquee_Image_6.png" },
  { name: "한농연", image: "/Marquee/Marquee_Image_7.png" },
  { name: "보들미억", image: "/Marquee/Marquee_Image_8.png" },
  { name: "진짜물회", image: "/Marquee/Marquee_Image_9.png" },
  { name: "짱궤", image: "/Marquee/Marquee_Image_10.png" },
  { name: "교동짬뽕", image: "/Marquee/Marquee_Image_11.png" },
  { name: "부산 삼대갈비", image: "/Marquee/Marquee_Image_12.png" },
  { name: "국수밥상", image: "/Marquee/Marquee_Image_13.png" },
  { name: "상무별밤", image: "/Marquee/Marquee_Image_14.png" },
  { name: "밥을짓다", image: "/Marquee/Marquee_Image_15.png" },
  { name: "동인정갈비찜", image: "/Marquee/Marquee_Image_16.png" },
  { name: "철든쭈꾸미", image: "/Marquee/Marquee_Image_17.png" },
  { name: "이슈모리", image: "/Marquee/Marquee_Image_18.png" },
  { name: "난향면옥", image: "/Marquee/Marquee_Image_19.png" },
];

const DURATION = 60; // 한 사이클 전체 시간(초) - 훨씬 더 느리게

function MarqueeRow({ direction = "left", delay = 0, storeData }: { direction?: "left" | "right"; delay?: number; storeData: typeof stores }) {
  // storeData 길이에 맞게 계산
  const totalStores = storeData.length;
  const copies = 4; // 4번 복제해서 충분한 길이 확보
  
  
  // 전체 이미지 중 약 75%까지 스크롤하여 모든 이미지가 보이도록
  const scrollPercent = 75;
  
  const fromX = direction === "left" ? "0%" : `-${scrollPercent}%`;
  const toX = direction === "left" ? `-${scrollPercent}%` : "0%";
  
  return (
    <motion.div
      className="flex gap-3 md:gap-6"
      initial={{ x: fromX }}
      animate={{ x: [fromX, toX] }}
      transition={{
        x: {
          repeat: Infinity,
          repeatType: "mirror",
          duration: DURATION,
          ease: "linear",
          delay,
        },
      }}
      style={{ width: `${copies * 100}%` }} // 4배 너비로 충분한 공간 확보
    >
      {Array(copies).fill(storeData).flat().map((store, i) => (
        <div
          key={i}
          className="w-[200px] h-[130px] md:w-[392px] md:h-[256px] flex-shrink-0 rounded-xl relative overflow-hidden"
        >
          {/* 이미지 */}
          <img
            src={store.image}
            alt={store.name}
            className="absolute inset-0 w-full h-full object-cover rounded-xl z-0"
          />
        </div>
      ))}
    </motion.div>
  );
}

export default function MarqueeSection() {
  // 배열을 반으로 나누기
  const midIndex = Math.ceil(stores.length / 2);
  const firstHalf = stores.slice(0, midIndex);
  const secondHalf = stores.slice(midIndex);

  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-700 mb-4 text-center px-4">
        KT지니원과 함께해준 매장
      </h2>
      {/* 위쪽: 왼쪽으로, 첫 번째 반 */}
      <div className="relative h-[130px] md:h-[256px] w-full overflow-hidden">
        <MarqueeRow direction="left" delay={0} storeData={firstHalf} />
      </div>
      <div className="h-4 md:h-8" />
      {/* 아래쪽: 오른쪽으로, 두 번째 반 */}
      <div className="relative h-[130px] md:h-[256px] w-full overflow-hidden">
        <MarqueeRow direction="right" delay={0} storeData={secondHalf} />
      </div>
    </section>
  );
} 