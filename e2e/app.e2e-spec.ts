import { by, element } from "protractor";
import { AngularElectronPage } from "./app.po";

describe("fotobox App", () => {
  let page: AngularElectronPage;

  beforeEach(() => {
    page = new AngularElectronPage();
  });

  it("should display message saying App works !", () => {
    page.navigateTo("/");
    expect(element(by.css("app-home h1")).getText()).toMatch("App works !");
  });
});
