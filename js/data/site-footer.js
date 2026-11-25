const footerTarget = document.querySelector('[data-site-footer]');

if (footerTarget) {
  const commonFooter = `
    <footer class="footer site-footer">
      <div class="footer-wrap pbmit-footer-big-area">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="pbmit-footer-logo">
                <img src="images/logo2.svg" alt="Rajat Demo Association">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pbmit-footer-widget-area">
        <div class="container">
          <div class="row">
            <div class="col-md-6 col-lg-3">
              <div class="widget pbmit-two-column-menu">
                <h2 class="widget-title">Discover</h2>
                <div class="textwidget">
                  <ul>
                    <li><a href="#">Coaching</a></li>
                    <li><a href="#">Consulting</a></li>
                    <li><a href="#">Courses</a></li>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Client Stories</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Contact Us</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-2">
              <div class="pbmit-two-widget">
                <div class="widget">
                  <h3 class="widget-title">Support</h3>
                  <div class="textwidget">
                    <ul>
                      <li><a href="#">Facebook</a></li>
                      <li><a href="#">Twitter</a></li>
                      <li><a href="#">Linkedin</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3">
              <div class="widget">
                <h3 class="widget-title">Contact</h3>
                <div class="pbmit-contact-widget-lines">
                  <div class="pbmit-contact-widget-line widget-address">hello@attorly.com</div>
                  <div class="pbmit-contact-widget-line widget-phone">877 . 485 . 0700</div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="widget">
                <h2>Stop informing.<br>Start inspiring.</h2>
                <p>Let’s Stay in Touch</p>
                <div class="pbmit-footer-newsletter">
                  <input type="email" name="EMAIL" placeholder="Enter your Email" required="">
                  <button type="submit" value="Sign up">
                    <i class="pbmit-base-icon-right-arrow-1"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pbmit-footer-section">
        <div class="container">
          <div class="pbmit-footer-text-inner">
            <div class="row">
              <div class="col-md-6">
                <div class="pbmit-footer-copyright-text-area"> Copyright © 2022 
                  <a href="#">Rajat Demo Association</a>, All Rights Reserved.
                </div>
              </div>
              <div class="col-md-6">
                <div class=" pbmit-footer-menu-area">
                  <div class="menu-copyright-menu-container">
                    <ul class="pbmit-footer-menu">
                      <li class="menu-item"><a href="#">Services</a></li>
                      <li class="menu-item"><a href="#">Faq</a></li>
                      <li class="menu-item"><a href="#">Careers</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `;

  footerTarget.innerHTML = commonFooter;
}
