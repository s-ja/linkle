import { z } from "zod";

import {
  DIVIDE_ICON,
  EVENT_ICON,
  IMAGE_ICON,
  LINK_ICON,
  TEXT_ICON,
  VIDEO_ICON,
} from "../../public/assets/icons";

// StaticImageData 스키마 정의
const StaticImageDataSchema = z.object({
  src: z.string(),
  height: z.number(),
  width: z.number(),
  blurDataURL: z.string().optional(),
  blurWidth: z.number().optional(),
  blurHeight: z.number().optional(),
});

export const BlockTypeSchema = z.object({
  title: z.string(),
  text: z.string(),
  icon: StaticImageDataSchema,
  path: z.string(),
});

export type BlockType = z.infer<typeof BlockTypeSchema>;

export type TypeBlock = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type BlockTypesType = Exclude<TypeBlock, 7>;
type BlockTypes = {
  [key in BlockTypesType]: BlockType;
};
export const blockTypes: BlockTypes = {
  1: {
    title: "링크",
    text: "연결하고 싶은 url은 무엇이든 추가하세요",
    icon: LINK_ICON,
    path: "/admin/link",
  },
  2: {
    title: "텍스트",
    text: "공유하고 싶은 글이 있다면 적어보세요",
    icon: TEXT_ICON,
    path: "/admin/text",
  },
  3: {
    title: "이미지",
    text: "보여주고 싶은 이미지로 표현하세요",
    icon: IMAGE_ICON,
    path: "/admin/image",
  },
  4: {
    title: "구분선",
    text: "블록과 블록 사이를 구분할 수 있어요",
    icon: DIVIDE_ICON,
    path: "/admin/divider",
  },
  5: {
    title: "동영상",
    text: "유튜브, 틱톡 등 동영상을 공유하세요",
    icon: VIDEO_ICON,
    path: "/admin/video",
  },
  6: {
    title: "이벤트",
    text: "이벤트 응모부터, 추첨까지 진행해보세요",
    icon: EVENT_ICON,
    path: "/admin/event",
  },
};
