import { useRef } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import debounce from 'lodash/debounce'

type Props = {
    onInputChange: (filter: string) => void
}

const InputBusqueda = (props: Props) => {
    const searchInput = useRef(null)
 
    const handleEdit = debounce(() => {
        props.onInputChange(searchInput.current?.value);
    }, 500) 

/*     const handleEdit = () => {
        props.onInputChange(searchInput.current?.value);
    } */

    return (
        <Input
            ref={searchInput}
            className="max-w-md md:w-52 md:mb-0 mb-4"
            size="sm"
            placeholder="Buscar musculo"
            prefix={<HiOutlineSearch className="text-lg" />}
            onChange={handleEdit}
        />
    )
}

export default InputBusqueda
