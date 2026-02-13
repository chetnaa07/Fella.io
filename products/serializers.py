from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant, Review, Wishlist


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'image', 'is_active', 'product_count')

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'alt_text', 'is_primary', 'order')


class ProductVariantSerializer(serializers.ModelSerializer):
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = ProductVariant
        fields = ('id', 'size', 'color', 'color_hex', 'stock', 'sku', 'in_stock')


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'username', 'rating', 'title', 'comment', 'created_at')
        read_only_fields = ('user',)


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product listing pages."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    selling_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    avg_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    available_colors = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'brand', 'category_name', 'gender',
            'price', 'discount_percent', 'selling_price',
            'primary_image', 'avg_rating', 'review_count',
            'available_colors', 'is_featured',
        )

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            return ProductImageSerializer(img).data
        return None

    def get_avg_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews.exists():
            return round(sum(r.rating for r in reviews) / reviews.count(), 1)
        return 0

    def get_review_count(self, obj):
        return obj.reviews.count()

    def get_available_colors(self, obj):
        colors = obj.variants.values_list('color', 'color_hex').distinct()
        return [{'color': c[0], 'hex': c[1]} for c in colors]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full detail serializer for product detail page."""
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    selling_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    avg_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'brand', 'description', 'category',
            'gender', 'price', 'discount_percent', 'selling_price',
            'images', 'variants', 'reviews',
            'avg_rating', 'review_count', 'is_featured',
            'created_at',
        )

    def get_avg_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews.exists():
            return round(sum(r.rating for r in reviews) / reviews.count(), 1)
        return 0

    def get_review_count(self, obj):
        return obj.reviews.count()


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = Wishlist
        fields = ('id', 'product', 'product_id', 'added_at')
        read_only_fields = ('user',)
