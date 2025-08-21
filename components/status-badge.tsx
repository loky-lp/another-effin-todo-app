import type { VariantProps } from 'class-variance-authority'
import { TaskStatus } from '@prisma/client'
import { Badge, badgeVariants } from '@/components/ui/badge'
import type { LucideIcon } from 'lucide-react'
import { CircleDashed, CircleCheckBig, CircleEllipsis } from 'lucide-react'

export type StatusBadgeMapItem = {
	text: string
	variant?: VariantProps<typeof badgeVariants>['variant']
	className?: string
	Icon: LucideIcon
}

const statusMap = new Map<TaskStatus, StatusBadgeMapItem>([
	[
		'PENDING',
		{
			text: 'Da fare',
			className: 'text-black bg-yellow-400',
			Icon: CircleDashed,
		},
	],
	[
		'IN_PROGRESS',
		{
			text: 'In corso',
			className: 'text-white bg-green-600',
			Icon: CircleEllipsis,
		},
	],
	[
		'DONE',
		{
			text: 'Fatto',
			className: 'text-white bg-violet-600',
			Icon: CircleCheckBig,
		},
	],
])

export default function StatusBadge({ status }: { status: TaskStatus }) {
	const details = statusMap.get(status)

	if (!details) return null

	const { text, Icon, ...props } = details
	return (
		<Badge {...props}>
			<Icon />
			{text}
		</Badge>
	)
}
