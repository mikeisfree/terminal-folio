"use client";

import React, { useState, useEffect } from "react";
import { Globe } from "@/components/magicui/globe";

// Helper function to format time
const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  // const seconds = String(date.getSeconds()).padStart(2, "0");
  // return `${hours} : ${minutes} : ${seconds}`;
  return `${hours} : ${minutes}`;
};

// Helper function to format date
const formatDate = (date: Date): { year: string; monthDay: string } => {
  const year = String(date.getFullYear());
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = String(date.getDate()).padStart(2, "0");
  return { year, monthDay: `${month} ${day}` };
};

// Helper function for uptime (simple simulation)
const formatUptime = (startTime: number): string => {
  const now = Date.now();
  const diffSeconds = Math.floor((now - startTime) / 1000);
  const days = Math.floor(diffSeconds / (24 * 60 * 60));
  const hours = Math.floor((diffSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((diffSeconds % (60 * 60)) / 60);
  const seconds = diffSeconds % 60;
  return `${days}d${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

// Helper function to generate random number within a range
const getRandom = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Memory Dots Component
const MemoryDots: React.FC<{
  rows: number;
  cols: number;
  activePercentage: number;
}> = ({ rows, cols, activePercentage }) => {
  const totalDots = rows * cols;
  const [activeDots, setActiveDots] = useState<boolean[][]>(
    Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newDots = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(false));
      const numActive = Math.floor(totalDots * (activePercentage / 100));
      let count = 0;
      while (count < numActive) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!newDots[r][c]) {
          newDots[r][c] = true;
          count++;
        }
      }
      setActiveDots(newDots);
    }, 500); // Update every 500ms for blinking effect

    return () => clearInterval(interval);
  }, [rows, cols, activePercentage]);

  return (
    <div
      className="grid gap-[2px]"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {activeDots.flat().map((isActive, index) => (
        <div
          key={index}
          className={`w-[3px] h-[3px] ${
            isActive
              ? "bg-[var(--main-accent)] opacity-90"
              : "bg-gray-700 opacity-30"
          }`}
        />
      ))}
    </div>
  );
};

export const SystemInfoSidebar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startTime] = useState(Date.now()); // Simulate app start time
  const [memoryUsage, setMemoryUsage] = useState(6.2);
  const [totalMemory] = useState(6.9);
  const [swapUsage, setSwapUsage] = useState(1.1);
  const [cpuUsage, setCpuUsage] = useState([100, 100]); // Avg for core groups 1-4, 5-8
  const [tasks, setTasks] = useState(283);
  const [topProcesses, setTopProcesses] = useState([
    { pid: 0, name: "System Idle Pro...", cpu: 91, mem: 0 },
    { pid: 624, name: "chrome.exe", cpu: 1, mem: 17.4 },
    { pid: 632, name: "svchost.exe", cpu: 0.2, mem: 8.5 },
    { pid: 3856, name: "Code.exe", cpu: 0.1, mem: 13.1 },
    { pid: 1248, name: "eDEX-UI.exe", cpu: 0, mem: 11.9 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const systemUpdateTimer = setInterval(() => {
      // Simulate fluctuations
      setMemoryUsage(getRandom(5.8, 6.5));
      setSwapUsage(getRandom(0.9, 1.3));
      setCpuUsage([getRandom(95, 100), getRandom(95, 100)]);
      setTasks(Math.floor(getRandom(270, 300)));
      setTopProcesses((prev) =>
        prev.map((p) => ({
          ...p,
          cpu:
            p.pid === 0
              ? getRandom(85, 95)
              : getRandom(0, p.pid === 624 ? 5 : 1), // Idle fluctuates more, chrome more active
          mem: p.pid === 0 ? 0 : getRandom(p.mem * 0.95, p.mem * 1.05), // Slight memory fluctuation
        }))
      );
    }, 2000); // Update system stats every 2 seconds

    return () => {
      clearInterval(timer);
      clearInterval(systemUpdateTimer);
    };
  }, []);

  const { year, monthDay } = formatDate(currentTime);
  const uptime = formatUptime(startTime);
  const memoryPercentage = (memoryUsage / totalMemory) * 100;

  const renderHorizontalLine = () => (
    <div className="w-full h-[1px] bg-gray-700 my-1 opacity-1"></div>
  );

  return (
    <div className="fixed top-0 left-0 hidden leading-0 md:flex flex-col h-full w-[15%] bg-[var(--terminal-background)] text-[var(--cyan-accent)] font-mono p-3 text-xs border-r border-gray-700 border-opacity-50 overflow-y-auto scrollbar-custom">
      {/* Header */}
      <div className="flex justify-between items-center text-[var(--main-text)] text-[10px] mb-2">
        <span>PANEL</span>
        <span>SYSTEM</span>
      </div>
      {renderHorizontalLine()}

      {/* Clock */}
      <div className="text-center text-3xl tracking-widest my-4">
        {formatTime(currentTime)}
      </div>
      {renderHorizontalLine()}

      {/* Date/Uptime/System Info */}
      <div className="grid grid-cols-4 gap-x-2 gap-y-1 text-[10px] mb-3">
        <span className="text-[var(--main-accent)] col-span-1">{year}</span>
        <span className="text-[var(--main-accent)] col-span-1">UPTIME</span>
        <span className="text-[var(--main-accent)] col-span-1">TYPE</span>
        <span className="text-[var(--main-accent)] col-span-1">POWER</span>
        <span className="col-span-1">{monthDay}</span>
        <span className="col-span-1">{uptime}</span>
        <span className="col-span-1">win</span> {/* Placeholder */}
        <span className="col-span-1">CHARGE</span> {/* Placeholder */}
      </div>

      {/* Manufacturer Info */}
      <div className="grid grid-cols-4 gap-x-2 gap-y-1 text-[10px]">
        <span className="text-[var(--main-accent)] col-span-1">
          MANUFACTURER
        </span>
        <span className="text-[var(--main-accent)] col-span-1">MODEL</span>
        <span className="text-[var(--main-accent)] col-span-2">CHASSIS</span>
        <span className="col-span-1">HUAWEI</span> {/* Placeholder */}
        <span className="col-span-1">NBLK-WAX9X</span> {/* Placeholder */}
        <span className="col-span-2">Notebook</span> {/* Placeholder */}
      </div>
      {renderHorizontalLine()}

      {/* CPU Usage */}
      <div>
        <div className="text-[var(--main-accent)] text-[10px] mb-1">
          CPU USAGE
        </div>
        <div className="text-[10px] mb-2">AMD Ryzen 7 3700U with Radeon V</div>{" "}
        {/* Placeholder */}
        <div className="text-[10px] mb-1"># 1 - 4</div>
        <div className="w-full h-1 bg-gray-700 bg-opacity-30 rounded-sm overflow-hidden mb-2">
          <div
            className="h-full bg-[var(--main-accent)]"
            style={{ width: `${cpuUsage[0]}%` }}
          ></div>
        </div>
        <div className="text-[10px] mb-1">Avg. {cpuUsage[0].toFixed(0)}%</div>
        <div className="text-[10px] mb-1 mt-2"># 5 - 8</div>
        <div className="w-full h-1 bg-gray-700 bg-opacity-30 rounded-sm overflow-hidden mb-2">
          <div
            className="h-full bg-[var(--main-accent)]"
            style={{ width: `${cpuUsage[1]}%` }}
          ></div>
        </div>
        <div className="text-[10px] mb-1">Avg. {cpuUsage[1].toFixed(0)}%</div>
      </div>

      {/* Core Info */}
      <div className="grid grid-cols-4 gap-x-2 text-[10px] mt-3">
        <span className="text-[var(--main-accent)]">CORES</span>
        <span className="text-[var(--main-accent)]">SPD</span>
        <span className="text-[var(--main-accent)]">MAX</span>
        <span className="text-[var(--main-accent)]">TASKS</span>
        <span>8</span> {/* Placeholder */}
        <span>2.3GHz</span> {/* Placeholder */}
        <span>2.3GHz</span> {/* Placeholder */}
        <span>{tasks}</span>
      </div>
      {renderHorizontalLine()}

      {/* Memory Usage */}
      <div>
        <div className="flex justify-between items-baseline text-[10px] mb-1">
          <span className="text-[var(--main-accent)]">MEMORY</span>
          <span className="text-[9px]">
            USING {memoryUsage.toFixed(1)} OUT OF {totalMemory} GiB
          </span>
        </div>
        <MemoryDots rows={8} cols={30} activePercentage={memoryPercentage} />
      </div>

      {/* Swap Usage */}
      <div className="mt-3">
        <div className="flex justify-between items-baseline text-[10px] mb-1">
          <span className="text-[var(--main-accent)]">SWAP</span>
          <span className="text-[9px]">{swapUsage.toFixed(1)} GiB</span>
        </div>
        <div className="w-full h-1 bg-gray-700 bg-opacity-30 rounded-sm overflow-hidden">
          {/* Simple swap bar, adjust width based on swapUsage relative to totalMemory maybe? */}
          <div
            className="h-full bg-[var(--main-accent)]"
            style={{ width: `${(swapUsage / totalMemory) * 100}%` }}
          ></div>
        </div>
      </div>
      {renderHorizontalLine()}

      {/* Top Processes */}
      <div>
        <div className="flex justify-between items-baseline text-[var(--main-accent)] text-[10px] mb-2">
          <span>TOP PROCESSES</span>
          <span>PID | NAME | CPU | MEM</span>
        </div>
        {topProcesses.map((proc) => (
          <div
            key={proc.pid}
            className="grid grid-cols-12 gap-x-1 text-[10px] mb-1 whitespace-nowrap overflow-hidden"
          >
            <span className="col-span-1 text-right">{proc.pid}</span>
            <span className="col-span-6 truncate ml-1">{proc.name}</span>
            <span className="col-span-2 text-right">
              {proc.cpu.toFixed(1)}%
            </span>
            <span className="col-span-3 text-right">
              {proc.mem.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      {/* Spacer to push content up, wrapping Globe to isolate */}
      <div id="sidebar-left" className="flex-grow">
        {" "}
        {/* Added overflow:hidden */}
        <Globe />
      </div>
    </div>
  );
};
