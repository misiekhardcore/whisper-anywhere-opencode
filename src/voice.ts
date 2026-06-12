export type VoiceState = {
  isEnabled(): boolean;
  toggle(): boolean;
};

export function createVoiceState(): VoiceState {
  let voiceEnabled = true;

  return {
    isEnabled: () => voiceEnabled,
    toggle: () => {
      voiceEnabled = !voiceEnabled;
      return voiceEnabled;
    },
  };
}
