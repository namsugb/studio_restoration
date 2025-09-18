"use client";

import { Oleo_Script } from "next/font/google";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { submitAlimtalkToStudio } from "../utils/kakao";
import ImageSlider from "../components/imageSlider";

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


const SLIDER_IMAGES = [
  "/slider/KakaoTalk_20250916_014044986.jpg",
  "/slider/KakaoTalk_20250916_014044986_01.jpg",
  "/slider/KakaoTalk_20250916_014044986_02.jpg",
  "/slider/KakaoTalk_20250916_014044986_04.jpg",
  "/slider/KakaoTalk_20250916_014044986_05.jpg",
  "/slider/KakaoTalk_20250916_014044986_06.jpg",
];



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


    submitAlimtalkToStudio(payload);


    setIsSubmitModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="logo"
                width={150}
                height={150}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg border-4 border-white"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              아침햇살 스튜디오
            </h1>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto px-4">
              고객님의 소중한 추억을 정성껏 복원합니다.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-8">
          {/* 메인 타이틀 섹션 */}
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-slate-600/30">
            <div className="text-center space-y-6">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent leading-tight">
                소중한 사진을 최신 디지털 기술로<br className="hidden md:block" />
                <span className="md:hidden"> </span>정성껏 복원합니다
              </h1>
              <div className="space-y-3 text-base md:text-lg text-slate-300 px-4">
                <p>고해상도 스캔부터 전문 복원 작업, 화질 개선, 고품질 인화까지 한 번에 진행합니다.</p>
                <p className="font-medium text-blue-300">배경/의상 교체도 가능합니다.</p>
              </div>
              <div className="relative mt-6 md:mt-8">
                <Image
                  src="/restoration.png"
                  alt="복원 작업 예시"
                  width={400}
                  height={200}
                  className="w-full max-w-2xl mx-auto h-auto rounded-2xl shadow-lg border border-white/50"
                />

              </div>
            </div>
          </div>

          {/* 슬라이더 */}
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl p-6 md:p-2 shadow-xl border border-slate-600/30">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                복원 작업 갤러리
              </h2>
              <p className="text-slate-300">
                전문적인 복원 기술로 소중한 추억을 되살려드립니다
              </p>
            </div>

            <ImageSlider SLIDER_IMAGES={SLIDER_IMAGES} />



          </div>
          {/* 상품 선택 */}
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-slate-600/30">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">상품 선택</h2>
              <p className="text-slate-300 text-sm md:text-base">원하시는 서비스를 선택해주세요</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRODUCTS.map((p) => {
                const checked = selectedIds.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={`group relative flex items-start gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${checked
                      ? 'border-blue-500 bg-slate-700 shadow-lg'
                      : 'border-slate-600 bg-slate-800 hover:border-blue-400'
                      }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${checked
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-400 group-hover:border-blue-400'
                        }`}>
                        {checked && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-semibold text-lg mb-1 ${checked ? 'text-blue-200' : 'text-white'}`}>
                            {p.name}
                          </h3>
                          <p className={`text-sm ${checked ? 'text-blue-300' : 'text-slate-300'}`}>
                            {p.description}
                          </p>
                        </div>
                        <div className={`text-right ${checked ? 'text-blue-300' : 'text-slate-300'}`}>
                          <span className="text-lg font-bold">
                            {p.price.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleProduct(p.id)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* 액자 선택 */}
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-slate-600/30">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">액자 선택</h2>
              <p className="text-slate-300 text-sm md:text-base">(기일용 20×25cm · 장례식용 28×35cm · 납골당용 9×13cm)</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {FRAME_OPTIONS.map((f) => (
                <label
                  key={f.id}
                  className={`group relative flex items-start gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedFrameId === f.id
                    ? 'border-blue-500 bg-slate-700 shadow-lg'
                    : 'border-slate-600 bg-slate-800 hover:border-blue-400'
                    }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${selectedFrameId === f.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-400 group-hover:border-blue-400'
                      }`}>
                      {selectedFrameId === f.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-semibold text-lg mb-1 ${selectedFrameId === f.id ? 'text-blue-200' : 'text-white'}`}>
                          {f.name}
                        </h3>
                        <p className={`text-sm ${selectedFrameId === f.id ? 'text-blue-300' : 'text-slate-300'}`}>
                          {f.description}
                        </p>
                      </div>
                      <div className={`text-right ${selectedFrameId === f.id ? 'text-blue-300' : 'text-slate-300'}`}>
                        <span className="text-lg font-bold">
                          {f.price === 0 ? "포함" : `+${f.price.toLocaleString()}원`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="frame"
                    className="sr-only"
                    checked={selectedFrameId === f.id}
                    onChange={() => setSelectedFrameId(f.id)}
                  />
                </label>
              ))}
            </div>
            <div className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl p-6 border border-slate-500">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">총 합계</span>
                <div className="text-right">
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {total.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 작업 신청서 */}
          <section className="bg-slate-800/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 my-8 shadow-xl border border-slate-600/30">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">작업 신청서</h2>
              <p className="text-slate-300 text-sm md:text-base">신청 정보를 입력해주세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-300">
                    성함 <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-600 bg-slate-700/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-white placeholder-slate-400"
                    placeholder="홍길동"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-300">
                    연락처 <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    required
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-600 bg-slate-700/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-white placeholder-slate-400"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-300">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full h-12 px-4 rounded-xl border-2 border-slate-600 bg-slate-700/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-white placeholder-slate-400"
                  placeholder="example@email.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="block text-sm font-semibold text-slate-300">
                  요청 사항
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  className="w-full p-4 rounded-xl border-2 border-slate-600 bg-slate-700/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-white placeholder-slate-400 resize-none"
                  placeholder="예) 배경 교체, 의상 정장 변경 등"
                />
              </div>

              <div className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl p-6 border border-slate-500">
                <div className="text-center space-y-2">
                  <div className="text-sm text-slate-300">
                    선택 상품 <span className="font-semibold text-blue-300">{selectedIds.length}개</span> ·
                    액자: <span className="font-semibold text-blue-300">{FRAME_OPTIONS.find(f => f.id === selectedFrameId)?.name}</span> ·
                    합계 <span className="font-bold text-blue-300 text-lg">{total.toLocaleString()}원</span>
                  </div>
                  <button
                    type="submit"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                  >
                    <span className="relative z-10">신청하기</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* 신청 완료 모달 */}
          {isSubmitModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSubmitModalOpen(false)} />
              <div className="relative z-10 w-full max-w-md bg-slate-800/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-slate-600/30 animate-in fade-in-0 zoom-in-95 duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">신청이 완료되었습니다</h3>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    아침햇살 카카오채널에 복원하시려는 사진을 보내면 작업이 진행됩니다.
                  </p>
                  <div className="space-y-3">
                    <a
                      href="https://pf.kakao.com/_SLhjK"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center w-full px-6 py-3 text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <span className="mr-2">💬</span>
                      카카오채널 바로가기
                    </a>
                    <button
                      className="w-full px-6 py-3 text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition-colors duration-200"
                      onClick={() => setIsSubmitModalOpen(false)}
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
