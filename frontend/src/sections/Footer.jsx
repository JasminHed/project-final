import styled from "styled-components";

const FooterContainer = styled.footer`
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 60px;
  text-align: center;
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
