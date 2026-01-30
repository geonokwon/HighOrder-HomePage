export interface MenuItem {
  id: number;
  name: string;
  price: number; // in KRW
  image: string;
  category: string;
  originalPrice?: number; // 할인 전 가격
  discountPercent?: number; // 할인율
  isSpicy?: boolean; // 매운 음식 여부
}

export const menuItems: MenuItem[] = [
  
  { id: 7, name: '김치찜', price: 15000, originalPrice: 18900, discountPercent: 22.6, image: '/menu_Images/new/07_KimchiPancake.png', category: '식사' },
  { id: 8, name: '두부김치', price: 20000, image: '/menu_Images/new/08_TofuPancake.png', category: '식사' },
  { id: 10, name: '모듬조개탕', price: 21900, image: '/menu_Images/new/10_AssortedSeafoodJeon.png', category: '식사', isSpicy: true },
  { id: 2, name: '경성계란말이', price: 15900, image: '/menu_Images/new/02_Gyeongseong_RolledOmelette.png', category: '식사' },
  { id: 9, name: '모듬전', price: 20000, image: '/menu_Images/new/09_AssortedJeon.png', category: '식사' },
  { id: 11, name: '부대찌게', price: 5500, image: '/menu_Images/new/11_BudaeJjigae.png', category: '식사' },
  { id: 13, name: '소금곱창구이', price: 19900, image: '/menu_Images/new/13_PorkBellyBBQ.png', category: '식사' },
  { id: 15, name: '훈제삼겹', price: 18900, image: '/menu_Images/new/15_SmokedPorkJeon.png', category: '식사' },

  { id: 5, name: '과일빙수', price: 13900, image: '/menu_Images/new/05_FruitBingsu.png', category: '디저트' },
  { id: 17, name: '요구르트샤베트', price: 6000, image: '/menu_Images/new/16_YogurtSherbet.png', category: '디저트' },

  { id: 6, name: '광장시장녹두전', price: 10000, image: '/menu_Images/new/06_BeanPancake.png', category: '사이드' },
  { id: 3, name: '경성부추전', price: 17900, image: '/menu_Images/new/03_Gyeongbuk_ChivePancake.png', category: '사이드' },
  { id: 4, name: '경성치즈감자전', price: 14900, image: '/menu_Images/new/04_Gyeongcheong_PotatoPancake.png', category: '사이드' },
  { id: 1, name: '경성감자전', price: 11900, image: '/menu_Images/new/01_Gyeongsang_PotatoPancake.png', category: '사이드' },
  { id: 12, name: '소고기육전', price: 17900, image: '/menu_Images/new/12_GrilledBeef.png', category: '사이드' },
  { id: 14, name: '일본전', price: 15900, image: '/menu_Images/new/14_JapanesePancake.png', category: '사이드' },
  { id: 18, name: '롱롱소세지', price: 8000, image: '/menu_Images/04_sausage.png', category: '사이드' },

  { id: 19, name: '후라이드치킨', price: 20000, image: '/menu_Images/11_cheese_boneless_chicken.png', category: '치킨' },
  { id: 20, name: '양념치킨', price: 20000, image: '/menu_Images/09_seasoned_boneless_chicken.png', category: '치킨' },
  

  { id: 21, name: '경성맥주', price: 4000, image: '/menu_Images/03_kyungsung_ice_beer.png', category: '주류' },
  { id: 16, name: '하이볼', price: 6000, image: '/menu_Images/10_oldcastle_grape_highball.png', category: '주류' },

]; 
