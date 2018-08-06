import {Component, Input} from '@angular/core';
import {LayoutInterface} from '../../../shared/layout.interface';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {
  @Input()
  target: LayoutInterface;
}
