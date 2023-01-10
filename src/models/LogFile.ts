
export class LogFile {
  index: number = 0
  name: string;
  content: string[];
  active = false;
  style = {
    cursor: "pointer",
    'background-color': '#dad5d5',
  };

  constructor(name: string, content: string[]) {
    this.name = name;
    this.content = content;
  }
}
