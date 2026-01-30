import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

// GET all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type') // PHYSICAL or DIGITAL
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      isActive: true,
    }

    if (category) {
      where.category = category
    }

    if (type) {
      where.type = type
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            businessName: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const total = await prisma.product.count({ where })

    return NextResponse.json({
      products,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new product
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has MERCHANT role
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId: session.user.id,
        role: 'MERCHANT',
        isActive: true,
      },
    })

    if (userRoles.length === 0) {
      return NextResponse.json(
        { error: 'Merchant role required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      category,
      type,
      price,
      images,
      deliveryRadius,
      stock,
      downloadUrl,
    } = body

    if (!name || !description || !category || !type || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        userId: session.user.id,
        name,
        description,
        category,
        type,
        price,
        images: images || [],
        deliveryRadius,
        stock,
        downloadUrl,
        isActive: true,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
