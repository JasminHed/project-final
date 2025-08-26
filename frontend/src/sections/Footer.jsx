import styled from "styled-components";

const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
  margin-top: auto; //presses to bottom
`;

const FooterList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  p {
    margin: 0;
    font-size: 14px;
    opacity: 0.7;
    font-weight: 400;
  }

  a {
    font-size: 15px;
    font-weight: 500;
    transition: opacity 0.2s ease;
  }

  @media (min-width: 668px) {
    gap: 24px;

    p {
      font-size: 15px;
    }

    a {
      font-size: 16px;
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterList>
        <li>
          <p>Copyright @ Jasmin Hedlund 2025</p>
        </li>
        <li>
          <a href="mailto:jasminhedlund@gmail.com">Contact Us</a>
        </li>
      </FooterList>
    </FooterContainer>
  );
};

export default Footer;
