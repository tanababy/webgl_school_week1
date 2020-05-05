type Member = {
  //型エイリアス
  name: string;
  age: number;
};

interface Members {
  //interfaceはイコールがいらない
  name: string;
  age: number;
}

type TASK_TYPE = 'content' | 'label' | 'milestone';
type MediaFormat = 'video' | 'audio' | 'image';

interface TaskResponse {
  status?: boolean;
  id?: string;
  timeline_id?: number;
  content_type: TASK_TYPE;
  categories: number[];
  fit: boolean;
  code: string;
  thumbnail: string;
  sound: boolean;
  format?: MediaFormat;
  isDeleteFile?: boolean;
  updated_at?: string;
}

type TimelineSummary = {
  id: string;
  complete: boolean;
  taskCount: number;
};

type Stage = {
  dates: { [s: string]: TimelineSummary[] };
  values?: string[];
};

type Dom = {
  el: HTMLElement | null;
};

export default class KeyvisualInteraction {
  public group = 'Nogizaka46';

  constructor(public name: string, public DOM: Dom) {} //constructorの引数でアクセス修飾子を追加すると、初期化もやってくれる
}
