export interface FableCharacter {
  name: string;
  species: string;
  archetype: string;
}

export interface DialogueLine {
  character: string;
  line: string;
}

export interface FableScene {
  characters: string[];
  dialogue: DialogueLine[];
  action: string;
  subtext: string;
}

export interface FableTwist {
  content: string;
}

export interface FableMeta {
  title: string;
  subtitle: string;
  tags: string[];
  characters: FableCharacter[];
  slug: string;
  type: string;
  date: string;
}

export interface FableContent {
  setup: string;
  scenes: FableScene[];
  twist: FableTwist;
  moral_question: string;
}

export interface FableProps {
  meta: FableMeta;
  content: FableContent;
}
