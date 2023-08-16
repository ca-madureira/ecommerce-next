import Link from 'next/link';
import Container from '../Container';
import FooterList from './FooterList';
import { MdFacebook } from 'react-icons/md';
import {
  AiFillTwitterCircle,
  AiFillInstagram,
  AiFillYoutube,
} from 'react-icons/ai';

const Footer = () => {
  return (
    <footer className="bg-slate-700 text-slate-200 text-sm mt-16">
      <Container>
        <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
          <FooterList>
            <h3 className="text-base font-bold mb-2">Atendimento</h3>
            <Link href="#">Contate-nos</Link>
            <Link href="#">Politica de Envio</Link>
            <Link href="#">Devoluções & Trocas</Link>
            <Link href="#">FAQs</Link>
          </FooterList>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-base font-bold mb-2">Sobre nós</h3>
            <p className="mb-2">
              Em nossa loja de eletrônicos, nos dedicamos a fornecer o que há de
              mais recente e os melhores dispositivos e acessórios para nossos
              clientes. Com um amplo seleção de telefones, TVs, laptops,
              relógios e acessórios
            </p>
            <p>
              &copy; {new Date().getFullYear()} E-Store. Todos os direitos
              reservados
            </p>
          </div>
          <FooterList>
            <h3 className="text-base font-bold mb-2">Siga-nos</h3>
            <div className="flex gap-2">
              <Link href="#">
                <MdFacebook size={24} />
              </Link>
              <Link href="#">
                <AiFillTwitterCircle size={24} />
              </Link>
              <Link href="#">
                <AiFillInstagram size={24} />
              </Link>
              <Link href="#">
                <AiFillYoutube size={24} />
              </Link>
            </div>
          </FooterList>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
