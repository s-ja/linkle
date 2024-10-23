"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import CalendarView from "./calendar-view";
import ListView from "./list-view";
import { Schedule } from "./types";

interface ApiSchedule {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
  url?: string;
}

interface CalendarBlock {
  id: number;
  type: number;
  sequence: number;
  style: number;
  schedule: ApiSchedule[];
}

const sampleSchedules: Schedule[] = [
  {
    id: "1",
    title: "[SAMPLE] 첫 번째 일정 예시",
    startDate: "2023-01-02T00:00:00.000Z",
    endDate: "2023-01-06T01:00:00.000Z",
  },
  {
    id: "2",
    title: "[SAMPLE] 두 번째 일정 예시",
    startDate: "2023-01-05T06:00:00.000Z",
    endDate: "2023-01-10T01:00:00.000Z",
  },
  {
    id: "3",
    title: "[SAMPLE] 세 번째 일정 예시",
    startDate: "2023-01-10T02:00:00.000Z",
    endDate: "2023-01-13T04:00:00.000Z",
  },
];

export default function StyleSetting() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeView, setActiveView] = useState<"list" | "calendar">("list");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [calendarBlock, setCalendarBlock] = useState<CalendarBlock | null>(
    null,
  );
  const [hasUserSchedules, setHasUserSchedules] = useState(false);

  const fetchSchedules = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/link/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.code === 200 && Array.isArray(data.data)) {
        const foundCalendarBlock = data.data.find(
          (item: CalendarBlock) => item.type === 7,
        );

        if (foundCalendarBlock && Array.isArray(foundCalendarBlock.schedule)) {
          setCalendarBlock(foundCalendarBlock);
          const formattedSchedules: Schedule[] =
            foundCalendarBlock.schedule.map(
              (schedule: ApiSchedule): Schedule => ({
                id: String(schedule.id),
                title: schedule.title,
                startDate: schedule.dateStart,
                endDate: schedule.dateEnd,
                url: schedule.url,
              }),
            );
          setSchedules(formattedSchedules);
          setHasUserSchedules(formattedSchedules.length > 0);
        }
      }
    } catch (err) {
      console.error("Error fetching schedules:", err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const toggleOpen = () => setIsOpen(!isOpen);

  const currentSchedules = hasUserSchedules ? schedules : sampleSchedules;

  return (
    <div className="flex w-full max-w-4xl flex-col px-14 py-0">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">스타일 설정</h2>
        <button onClick={toggleOpen} className="cursor-pointer">
          <Image
            src={
              isOpen
                ? "/assets/icons/icon_up.png"
                : "/assets/icons/icon_down.png"
            }
            alt={isOpen ? "접기" : "펼치기"}
            width={20}
            height={20}
          />
        </button>
      </div>
      {isOpen && (
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex space-x-8">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={activeView === "list"}
                  onChange={() => setActiveView("list")}
                  className="form-radio h-5 w-5 border-gray-300 text-gray-400 focus:ring-gray-400"
                />
                <span className="ml-2 text-gray-400">리스트뷰</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={activeView === "calendar"}
                  onChange={() => setActiveView("calendar")}
                  className="form-radio h-5 w-5 border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 text-gray-400">캘린더뷰</span>
              </label>
            </div>
          </div>
          {activeView === "list" ? (
            <ListView schedules={currentSchedules} />
          ) : (
            <CalendarView
              schedules={currentSchedules}
              hasUserSchedules={hasUserSchedules}
            />
          )}
        </div>
      )}
      <hr className="border-gray-105 ml-2 mr-2 mt-2 border-t-2" />
    </div>
  );
}