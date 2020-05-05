export default class Layout {
  public isMobile = false;
  public isTablet = false;
  public isDesktop = false;
  public windowWidth = 0;
  public windowHeight = 0;
  public breakpointSP = 767;
  public breakpointTAB = 1111;

  constructor() {
    this.onResize();
    this.bindEvents();
  }

  bindEvents(): void {
    window.addEventListener('resize', () => {
      this.onResize();
      console.log('resize!');
    });
  }

  onResize(): void {
    this.isMobile = window.matchMedia(`(max-width: ${this.breakpointSP}px)`).matches;
    this.isTablet = window.matchMedia(`(max-width: ${this.breakpointTAB}px)`).matches;
    this.isDesktop = !this.isMobile && !this.isTablet;

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }
}
