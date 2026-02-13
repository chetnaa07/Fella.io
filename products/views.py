from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, Review, Wishlist
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ReviewSerializer, WishlistSerializer,
)
from .filters import ProductFilter


class CategoryListView(generics.ListAPIView):
    """GET /api/products/categories/"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = (permissions.AllowAny,)


class ProductListView(generics.ListAPIView):
    """GET /api/products/ — supports search, filter, sort (Myntra-style)."""
    serializer_class = ProductListSerializer
    permission_classes = (permissions.AllowAny,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filterset_class = ProductFilter
    search_fields = ('name', 'brand', 'description', 'category__name')
    ordering_fields = ('price', 'created_at', 'discount_percent', 'name')
    ordering = ('-created_at',)

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related('category').prefetch_related('images', 'variants', 'reviews')


class ProductDetailView(generics.RetrieveAPIView):
    """GET /api/products/<slug>/"""
    serializer_class = ProductDetailSerializer
    permission_classes = (permissions.AllowAny,)
    lookup_field = 'slug'

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related('category').prefetch_related('images', 'variants', 'reviews')


class FeaturedProductsView(generics.ListAPIView):
    """GET /api/products/featured/"""
    serializer_class = ProductListSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        return Product.objects.filter(is_active=True, is_featured=True).prefetch_related('images', 'variants', 'reviews')[:12]


class ReviewCreateView(generics.CreateAPIView):
    """POST /api/products/<slug>/reviews/"""
    serializer_class = ReviewSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        product = Product.objects.get(slug=self.kwargs['slug'])
        serializer.save(user=self.request.user, product=product)


class WishlistView(generics.ListCreateAPIView):
    """GET/POST /api/products/wishlist/"""
    serializer_class = WishlistSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related('product')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WishlistDeleteView(generics.DestroyAPIView):
    """DELETE /api/products/wishlist/<pk>/"""
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
