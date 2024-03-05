const speaker = new class {
  active = false;

  handler(text, element) {
    if(text === '') {
      return;
    }

    if (!this.active) {
      this.active = true;
      element.classList.add('active');
      
      responsiveVoice.speak(text, 'Brazilian Portuguese Female', {
        onend: () => {
          element.classList.remove('active');
          this.active = false;
        }
      });
    } else {
      this.active = false;
      responsiveVoice.cancel();
      element.classList.remove('active');
    }
  }
}