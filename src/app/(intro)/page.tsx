import Image from "next/image";
import Link from "next/link";
import { ClientRoute } from "@config/route";

export default function Intro() {
  return (
    <div className={"flex w-full flex-col items-center py-10"}>
      <Image
        className="dark:invert"
        src="https://nextjs.org/icons/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      />
      <Link href={ClientRoute.LOGIN as string} className={"button color"}>
        시작하기
      </Link>
      <Link href={ClientRoute.ADMIN as string} className={"button color"}>
        관리자
      </Link>
    </div>
  );
}
