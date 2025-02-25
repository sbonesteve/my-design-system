import { Directive, ElementRef, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from "@angular/core";

@Directive({
  selector: "ds-button",
})
export class ButtonDirective implements OnInit, OnChanges {
  @Input() primary: boolean = false;
  @Input() size: string = "medium";
  @Input() label: string = "";
  @Output() click = new EventEmitter<MouseEvent>();

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // S'assurer que l'élément est bien un ds-button
    if (this.el.nativeElement.tagName.toLowerCase() !== "ds-button") {
      console.warn("ButtonDirective should be applied to a ds-button element");
    }

    // Ajouter un écouteur d'événement
    this.el.nativeElement.addEventListener("click", (event: MouseEvent) => {
      this.click.emit(event);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // Mettre à jour les attributs du Web Component lorsque les @Input changent
    if (changes.primary) {
      if (this.primary) {
        this.el.nativeElement.setAttribute("primary", "");
      } else {
        this.el.nativeElement.removeAttribute("primary");
      }
    }

    if (changes.size) {
      this.el.nativeElement.setAttribute("size", this.size);
    }

    if (changes.label) {
      this.el.nativeElement.setAttribute("label", this.label);
    }
  }
}
