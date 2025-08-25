"use client";

import { Oleo_Script } from "next/font/google";
import Image from "next/image";
import { useMemo, useState } from "react";
import { submitAlimtalkToStudio } from "../utils/kakao";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

const PRODUCTS: Product[] = [
  { id: "basic-memorial", name: "기일용 (유지)", description: "기본액자 포함, 의상/배경 유지", price: 90000 },
  { id: "basic-memorial-change", name: "기일용 (교체)", description: "기본액자 포함, 의상/배경 교체", price: 110000 },
  { id: "basic-funeral", name: "장례식용 (유지)", description: "기본액자 포함, 의상/배경 유지", price: 100000 },
  { id: "basic-funeral-change", name: "장례식용 (교체)", description: "기본액자 포함, 의상/배경 교체", price: 120000 },
  { id: "premium-upgrade", name: "고급 작업 추가", description: "화질개선, 피부/머리카락 디테일 표현", price: 50000 },
];

type FrameOption = {
  id: string;
  name: string;
  description: string;
  price: number;
};

const FRAME_OPTIONS: FrameOption[] = [
  { id: "frame-basic", name: "기본액자", description: "상품 기본 포함", price: 0 },
  { id: "frame-premium", name: "고급액자", description: "고급 프레임, +30,000원", price: 30000 },
];

const KAKAO_CHANNEL_URL = "https://pf.kakao.com"; // 카카오채널 링크를 실제 주소로 바꿔주세요

export default function Home() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedFrameId, setSelectedFrameId] = useState<string>("frame-basic");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  const productsTotal = useMemo(() => {
    return selectedIds.reduce((sum, id) => {
      const product = PRODUCTS.find((p) => p.id === id);
      return sum + (product?.price ?? 0);
    }, 0);
  }, [selectedIds]);

  const framePrice = useMemo(() => {
    return FRAME_OPTIONS.find((f) => f.id === selectedFrameId)?.price ?? 0;
  }, [selectedFrameId]);

  const total = productsTotal + framePrice;

  function toggleProduct(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  }


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement | null)?.value ?? "";
    const phone = (form.elements.namedItem("phone") as HTMLInputElement | null)?.value ?? "";
    const email = (form.elements.namedItem("email") as HTMLInputElement | null)?.value ?? "";
    const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement | null)?.value ?? "";

    const selectedProductNames = selectedIds
      .map((id) => PRODUCTS.find((p) => p.id === id)?.name)
      .filter((name): name is string => Boolean(name));
    const selectedFrameName = FRAME_OPTIONS.find((f) => f.id === selectedFrameId)?.name ?? "";
    const payload = {
      name,
      phone,
      email,
      notes,
      selectedProducts: selectedProductNames,
      selectedFrame: selectedFrameName,
      framePrice,
      total,
    };

    // TODO: 알림톡 전송 활성화 시 사용
    // submitAlimtalkToStudio(payload);


    setIsSubmitModalOpen(true);
  }

  return (
    <div className="min-h-screen w-full mx-auto px-6 py-10 bg-white  text-black">
      <header className="flex justify-center items-center mb-8">
        <Image src="/logo.png" alt="logo" width={200} height={200} className="w-20 h-auto" />
        <h1 className="text-2xl font-bold">아침햇살 스튜디오</h1>
      </header>

      <section className="grid md:grid-cols-2 gap-10 mb-10">
        <div>
          <Image src="/restoration.png" alt="sample" width={260} height={120} className="mb-4 w-full h-auto" />
          <p className="text-sm leading-6">
            소중한 사진을 최신 디지털 기술로 정성껏 복원합니다. 고해상도 스캔부터
            전문 복원 작업, 화질 개선, 고품질 인화까지 한 번에 진행합니다. 배경/의상
            교체도 가능합니다.
          </p>
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Before / After 예시</h3>
            <div className="grid grid-cols-2 gap-4">
              <figure className="border border-black/20 rounded-md p-2 text-center">
                <div className="text-xs mb-2 opacity-70">Before</div>
                <Image src="/before.jpg" alt="before" width={300} height={380} className="w-full h-auto object-cover rounded" />
              </figure>
              <figure className="border border-black/20 rounded-md p-2 text-center">
                <div className="text-xs mb-2 opacity-70">After</div>
                <Image src="/after.jpg" alt="after" width={300} height={380} className="w-full h-auto object-cover rounded" />
              </figure>
            </div>
            <p className="text-xs opacity-70 mt-2">이미지는 예시입니다. 결과는 원본 상태에 따라 달라질 수 있습니다.</p>
          </div>
          <ul className="text-sm leading-6 list-disc pl-5 mt-3">
            <li>고해상도 스캔</li>
            <li>전문 복원 작업: 찢김, 얼룩, 변색 등 세밀 복원</li>
            <li>화질 개선: 선명도와 대비 조정</li>
            <li>고품질 인화 및 액자 제공</li>
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-black p-4">
            <h2 className="font-semibold mb-3">상품 선택</h2>
            <div className="space-y-3">
              {PRODUCTS.map((p) => {
                const checked = selectedIds.includes(p.id);
                return (
                  <label key={p.id} className="flex items-start gap-3 p-3 rounded-md border border-black cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={checked}
                      onChange={() => toggleProduct(p.id)}
                    />
                    <span>
                      <span className="font-medium">{p.name}</span>
                      <span className="block text-xs opacity-80">{p.description}</span>
                    </span>
                    <span className="ml-auto text-sm font-semibold">
                      {p.price.toLocaleString()}원
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-black p-4">
            <h2 className="font-semibold mb-1">액자 선택</h2>
            <div className="text-xs opacity-80 mb-3">

              <div>(기일용 20×25cm · 장례식용 28×35cm · 납골당용 9×13cm)</div>

            </div>
            <div className="space-y-3">
              {FRAME_OPTIONS.map((f) => (
                <label key={f.id} className="flex items-start gap-3 p-3 rounded-md border border-black cursor-pointer">
                  <input
                    type="radio"
                    name="frame"
                    className="mt-1"
                    checked={selectedFrameId === f.id}
                    onChange={() => setSelectedFrameId(f.id)}
                  />
                  <span>
                    <span className="font-medium">{f.name}</span>
                    <span className="block text-xs opacity-80">{f.description}</span>
                  </span>
                  <span className="ml-auto text-sm font-semibold">{f.price === 0 ? "포함" : `+${f.price.toLocaleString()}원`}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-black">
              <span className="text-sm">총 합계</span>
              <strong className="text-lg">{total.toLocaleString()}원</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-black p-4">
        <h2 className="font-semibold mb-3">작업 신청서</h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm">성함</label>
            <input id="name" name="name" required className="h-10 px-3 rounded border border-black bg-transparent" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm">연락처</label>
            <input id="phone" name="phone" required className="h-10 px-3 rounded border border-black/15 bg-transparent" placeholder="010-0000-0000" />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="email" className="text-sm">이메일</label>
            <input id="email" name="email" type="email" className="h-10 px-3 rounded border border-black/15 bg-transparent" placeholder="example@email.com" />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="notes" className="text-sm">요청 사항</label>
            <textarea id="notes" name="notes" rows={4} className="p-3 rounded border border-black/15 bg-transparent" placeholder="예) 배경 교체, 의상 정장 변경 등" />
          </div>
          <div className="md:col-span-2 flex flex-wrap items-center justify-center gap-3">
            <div className="text-sm opacity-80">선택 상품 {selectedIds.length}개 · 액자: {FRAME_OPTIONS.find(f => f.id === selectedFrameId)?.name} / 합계 {total.toLocaleString()}원</div>
            <button type="submit" className="h-10 px-5 rounded bg-foreground text-background text-sm font-medium">
              신청하기
            </button>
          </div>
        </form>
      </section>
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSubmitModalOpen(false)} />
          <div className="relative z-10 w-[92%] max-w-md rounded-lg bg-white text-black p-6 shadow-xl border border-black/10">
            <h3 className="text-lg font-semibold mb-2">신청이 완료되었습니다</h3>
            <p className="text-sm leading-6 mb-4">
              아침햇살 카카오채널에 복원하시려는 사진을 보내면 작업이 진행됩니다.
            </p>
            <div className="flex items-center justify-end gap-2">
              <a
                href="https://pf.kakao.com/_SLhjK"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-4 rounded bg-yellow-500 text-white text-sm flex items-center"
              >
                카카오채널 바로가기
              </a>
              <button
                className="h-10 px-4 rounded border border-black/20 text-sm"
                onClick={() => setIsSubmitModalOpen(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
