from django.db import models


class Category(models.Model):
    """Product categories: T-Shirts, Jeans, Jackets, etc."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    """Main product model — Myntra-style clothing items."""
    GENDER_CHOICES = [
        ('M', 'Men'),
        ('W', 'Women'),
        ('U', 'Unisex'),
        ('K', 'Kids'),
    ]

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True)
    brand = models.CharField(max_length=100)
    description = models.TextField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='U')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percent = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def selling_price(self):
        """Price after discount."""
        return round(self.price * (1 - self.discount_percent / 100), 2)

    def __str__(self):
        return f"{self.brand} — {self.name}"


class ProductImage(models.Model):
    """Multiple images per product (Cloudinary)."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.product.name}"


class ProductVariant(models.Model):
    """Size + color variants with stock tracking."""
    SIZE_CHOICES = [
        ('XS', 'XS'),
        ('S', 'S'),
        ('M', 'M'),
        ('L', 'L'),
        ('XL', 'XL'),
        ('XXL', 'XXL'),
        ('28', '28'),
        ('30', '30'),
        ('32', '32'),
        ('34', '34'),
        ('36', '36'),
        ('38', '38'),
        ('FREE', 'Free Size'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    size = models.CharField(max_length=5, choices=SIZE_CHOICES)
    color = models.CharField(max_length=50)
    color_hex = models.CharField(max_length=7, blank=True, help_text='Hex code e.g. #000000')
    stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True)

    class Meta:
        unique_together = ('product', 'size', 'color')

    @property
    def in_stock(self):
        return self.stock > 0

    def __str__(self):
        return f"{self.product.name} — {self.size}/{self.color} ({self.stock})"


class Review(models.Model):
    """Product reviews & ratings."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])
    title = models.CharField(max_length=150, blank=True)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('product', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} — {self.rating}★ on {self.product.name}"


class Wishlist(models.Model):
    """User's wishlist."""
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username} ♡ {self.product.name}"
