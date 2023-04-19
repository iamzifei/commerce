import Image from 'next/image'
import logoImage from '../../../public/logo.png'

const Logo = ({ className = '', ...props }) => (
  <Image
    width="32"
    height="32"
    src={logoImage}
    alt="Logo"
    className={className}
    {...props}
  />
)

export default Logo
