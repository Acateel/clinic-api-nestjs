import * as Icons from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const Feedback = () => {
  const reviews = [
    {
      author: "Muhibur Rahman",
      rating: 5,
      text: "&quot;I have taken medical services from them. They treat so well and they are providing the best medical services.&quot;",
    },
    {
      author: "Muhibur Rahman",
      rating: 5,
      text: "&quot;I have taken medical services from them. They treat so well and they are providing the best medical services.&quot;",
    },
    {
      author: "Muhibur Rahman",
      rating: 5,
      text: "&quot;I have taken medical services from them. They treat so well and they are providing the best medical services.&quot;",
    },
    {
      author: "Muhibur Rahman",
      rating: 5,
      text: "&quot;I have taken medical services from them. They treat so well and they are providing the best medical services.&quot;",
    },
  ];

  return (
    <section className="mt-5">
      <Container>
        <div className="text-center">
          <h1>What our patients say</h1>
          <p className="mb-0">
            World-class care for everyone. Our health System offers
          </p>
          <p>unmatched, expert health care.</p>
        </div>
        <Slider
          dots={true}
          centerMode={true}
          slidesToShow={3}
          centerPadding={0}
          responsive={[
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
              },
            },
          ]}
          onInit={() => {
            const activeSlide = document.querySelector(
              ".slick-slide.slick-active.slick-center.slick-current"
            );
            activeSlide.classList.add("text-bg-primary");
          }}
          afterChange={() => {
            const activeSlide = document.querySelector(
              ".slick-slide.slick-active.slick-center.slick-current"
            );
            activeSlide.classList.add("text-bg-primary");
          }}
        >
          {reviews.map((review, index) => (
            <div key={index} className="p-3 rounded">
              <div className="d-flex align-items-center">
                <div>
                  <img
                    className="img-fluid"
                    src="patient-avatar.png"
                    alt="patient"
                  />
                </div>
                <div className="p-2">
                  <div className="fw-medium">{review.author}</div>
                  {[...Array(review.rating)].map((_, index) => (
                    <Icons.StarFill key={index} className="text-warning" />
                  ))}
                </div>
              </div>
              <p className="m-0">
                &quot;I have taken medical services from them. They treat so
                well and they are providing the best medical services.&quot;
              </p>
            </div>
          ))}
        </Slider>
      </Container>
    </section>
  );
};

export default Feedback;
