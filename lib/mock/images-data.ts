import type {
  IFeedAuthor,
  IProfileUser,
  ImageRatio,
  ImageStyle,
  Visibility,
} from "@/types";

// 피드/갤러리/상세/프로필이 공유하는 단일 이미지 목업 소스.
// 동일 id를 사용하므로 피드 카드 → 상세 진입 시 같은 작품이 그대로 연결된다.

export const CURRENT_USER: IProfileUser = {
  id: "me",
  name: "픽셀드리머",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=me",
  bio: "AI로 매일 새로운 장면을 그리는 비주얼 크리에이터입니다.",
  uploadCount: 0, // 아래 getProfile에서 동적으로 계산
  likeCount: 0,
};

const AUTHORS: IFeedAuthor[] = [
  { id: "user-1", name: "아트크리에이터", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=art1" },
  { id: "user-2", name: "네온드리머", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=neon2" },
  { id: "user-3", name: "판타지메이커", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=fantasy3" },
  { id: "user-4", name: "사이버페인터", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=cyber4" },
  { id: "user-5", name: "일러스트허브", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=illus5" },
  { id: "user-6", name: "캔버스러버", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=canvas6" },
];

const PROMPTS = [
  "사이버펑크 미래 도시의 네온 거리",
  "노을이 지는 산속의 고요한 호수",
  "판타지 세계의 떠다니는 섬과 폭포",
  "빈티지 카페에서의 따뜻한 오후 햇살",
  "우주를 유영하는 거대한 고래 떼",
  "벚꽃이 흩날리는 일본 전통 거리",
  "사막 한가운데 솟아오른 미래 도시",
  "오로라가 펼쳐진 설원의 깊은 밤",
];

const STYLES: ImageStyle[] = [
  "Anime",
  "Realistic",
  "Fantasy",
  "Cyberpunk",
  "Oil Painting",
];

const RATIOS: ImageRatio[] = ["1:1", "16:9", "9:16"];

const TOTAL_IMAGES = 48;
// 4의 배수 인덱스를 현재 사용자(나) 소유로 지정한다. → 약 12개
const OWNER_INTERVAL = 4;

export interface IImageRecord {
  id: string;
  imageUrl: string;
  prompt: string;
  style: ImageStyle;
  ratio: ImageRatio;
  likes: number;
  visibility: Visibility;
  createdAt: string;
  author: IFeedAuthor;
}

function getVisibility(index: number, isOwner: boolean): Visibility {
  if (isOwner) {
    // 내 작품은 공개/비공개를 고르게 섞어 갤러리 탭 데모가 풍부하도록 한다.
    return Math.floor(index / OWNER_INTERVAL) % 3 === 0 ? "private" : "public";
  }
  return index % 9 === 0 ? "private" : "public";
}

function buildImage(index: number): IImageRecord {
  const isOwner = index % OWNER_INTERVAL === 0;
  const author = isOwner
    ? { id: CURRENT_USER.id, name: CURRENT_USER.name, avatarUrl: CURRENT_USER.avatarUrl ?? "" }
    : AUTHORS[index % AUTHORS.length];

  const seed = `canvashub-${index}`;
  const daysAgo = index % 30;
  const createdAt = new Date(
    Date.now() - daysAgo * 24 * 60 * 60 * 1000 - (index % 12) * 60 * 60 * 1000
  ).toISOString();

  return {
    id: `img-${index + 1}`,
    imageUrl: `https://picsum.photos/seed/${seed}/${400 + (index % 3) * 80}/${500 + (index % 4) * 120}`,
    prompt: PROMPTS[index % PROMPTS.length],
    style: STYLES[index % STYLES.length],
    ratio: RATIOS[index % RATIOS.length],
    likes: Math.max(12, 2400 - index * 37 + (index % 7) * 89),
    visibility: getVisibility(index, isOwner),
    createdAt,
    author,
  };
}

const ALL_IMAGES: IImageRecord[] = Array.from({ length: TOTAL_IMAGES }, (_, i) =>
  buildImage(i)
);

export function getAllImages(): IImageRecord[] {
  return ALL_IMAGES;
}

export function getPublicImages(): IImageRecord[] {
  return ALL_IMAGES.filter((image) => image.visibility === "public");
}

export function getImageById(id: string): IImageRecord | undefined {
  return ALL_IMAGES.find((image) => image.id === id);
}

export function getOwnerImages(): IImageRecord[] {
  return ALL_IMAGES.filter((image) => image.author.id === CURRENT_USER.id);
}

export function getPublicImagesByAuthor(authorId: string): IImageRecord[] {
  return ALL_IMAGES.filter(
    (image) => image.author.id === authorId && image.visibility === "public"
  );
}

// 프로필 사용자 정보 + 공개 작품 기준 집계값(업로드 수/받은 좋아요 합계).
export function getProfile(authorId: string): IProfileUser | null {
  const publicImages = getPublicImagesByAuthor(authorId);
  const uploadCount = publicImages.length;
  const likeCount = publicImages.reduce((sum, image) => sum + image.likes, 0);

  if (authorId === CURRENT_USER.id) {
    return { ...CURRENT_USER, uploadCount, likeCount };
  }

  const author = AUTHORS.find((a) => a.id === authorId);
  if (!author) return null;

  return {
    id: author.id,
    name: author.name,
    avatarUrl: author.avatarUrl,
    bio: null,
    uploadCount,
    likeCount,
  };
}
