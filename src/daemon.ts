export type DaemonOutput = {
  text: string;
};

export type Daemon = {
  start: (client: any) => void;
  kill: () => Promise<void>;
};

export function startDaemon(onText: (text: string) => void): Daemon {
  const proc = Bun.spawn(["whisper-anywhere", "--stdout"], {
    stdout: "pipe",
    stderr: "inherit",
  });

  const reader = proc.stdout.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  const readLoop = async () => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() || "";
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line) as DaemonOutput;
          if (parsed.text) {
            onText(parsed.text);
          }
        } catch {
          // skip malformed JSON
        }
      }
    }
  };

  readLoop();

  return {
    start: () => {},
    kill: async () => {
      proc.kill();
      await proc.exited;
    },
  };
}
