import styled from "styled-components";

const FooterContainer = styled.footer`
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;

  padding: 40px;
  text-align: center;
`;

const FooterList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 10px;

  @media (min-width: 669px) {
    flex-direction: row;
    gap: 20px;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterList>
        <p>Copyright @ Jasmin Hedlund 2025</p>
        <a href="mailto:jasminhedlund@gmail.com">Contact Us</a>
      </FooterList>
    </FooterContainer>
  );
};

export default Footer;
