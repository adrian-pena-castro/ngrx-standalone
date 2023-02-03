import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenuComponent } from "../../components/main-menu/main-menu.component";

@Component({
    selector: 'app-home-container',
    standalone: true,
    templateUrl: './home-container.component.html',
    styleUrls: ['./home-container.component.scss'],
    imports: [CommonModule, MainMenuComponent]
})
export class HomeContainerComponent {

}
