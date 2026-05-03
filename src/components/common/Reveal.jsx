import { useInView } from '../../hooks/useInView'

const dirClass = {
  up:    'reveal',
  left:  'reveal-left',
  right: 'reveal-right',
  scale: 'reveal-scale',
  down:  'reveal-down',
}

export const Reveal = ({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  as: Tag = 'div',
}) => {
  const [ref, isInView] = useInView()
  const base = dirClass[direction] ?? 'reveal'

  return (
    <Tag
      ref={ref}
      className={`${base} ${isInView ? 'visible' : ''} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
