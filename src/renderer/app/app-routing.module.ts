import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { PhotoListComponent } from "./components/photo-list.ts/photo-list.component";
import { SetupComponent } from "./components/setup/setup.component";
import { CollageLayoutComponent } from "./layouts/collage-layout/collage-layout.component";
import { SingleLayoutComponent } from "./layouts/single-layout/single-layout.component";

const routes: Routes = [
  { path: "", component: SetupComponent },
  { path: "home", component: HomeComponent },
  { path: "photo-list", component: PhotoListComponent },
  {
    path: "layouts",
    children: [
      { path: "single", component: SingleLayoutComponent },
      { path: "collage/:id", component: CollageLayoutComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
