import { RestappPage } from './app.po';

describe('restapp App', function() {
  let page: RestappPage;

  beforeEach(() => {
    page = new RestappPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
