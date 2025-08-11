import styled from "styled-components";

const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  padding: 60px;
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

  @media (min-width: 669px) {
    gap: 20px;
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
